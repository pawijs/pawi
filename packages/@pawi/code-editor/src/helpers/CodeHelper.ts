// import { setGlobalKey } from '../../App/helper/WindowEvents'
import { CodeMirror } from './CodeMirror'
import { ScrubCode, TranspileCallback } from './types'

const worker = {
  //new Worker() //'build/codeWorker.js')
  addEventListener(type: any, clbk: (e: any) => void) {},
  postMessage(e: any) {},
}

interface Operation {
  id: string
  source: string
  callback: TranspileCallback
}

interface WorkerOperations {
  [key: string]: Operation
}

const WORKER_OPS: WorkerOperations = {}
const PENDING_OPS: string[] = []
let opid: number = 0

worker.addEventListener('message', e => {
  const { id, data } = e.data
  const op = WORKER_OPS[id]
  delete WORKER_OPS[id]

  if (!op) {
    console.log(`ERROR: Wrong worker response (operation ${id} not found).`)
  } else {
    // e.data === TranspileCallbackArgs
    op.callback(data)
  }
})

let runWork = (source: any, callback: any) => {
  ++opid
  const id = opid.toString()
  WORKER_OPS[id] = { id, source, callback }
  PENDING_OPS.push(id)
  // Without worker
  // callback ( compile ( source ) )
}

const ready: any = () => {
  runWork = (source, callback) => {
    ++opid
    const id = opid.toString()
    WORKER_OPS[id] = { id, source, callback }
    worker.postMessage({ id, source })
    // Without worker
    // callback ( compile ( source ) )
  }
  for (const v of PENDING_OPS) {
    const { id, source } = WORKER_OPS[v]
    worker.postMessage({ id, source })
  }
  PENDING_OPS.length = 0
}

WORKER_OPS['ready'] = { id: 'ready', callback: ready, source: '' }

// Without worker
// import { compile } from './codeWorker'

interface CMOptions {
  lucidity: EditorLucidityOptions
}

interface CMEditor extends CodeMirror.Editor {
  options: CMOptions
}

interface EditorLucidityOptions {
  scrubber: Scrubber
  lock?: string
  noscrub?: boolean
  blockId?: string // to detect change of block selection
  cursorMarkCleared?: boolean
  nosave?: boolean
  lang?: string
  // cache source to avoid setting the same source more then once
  source?: string
  mode?: string
  callbacks: Callbacks
}

export interface Scrubber extends ScrubCode {
  // Call init on block if value changes
  init?: any
}

const floatRe = /\./

const scrubdown = (e: MouseEvent, i: number, cm: CMEditor) => {
  // start click
  const ledit = cm.options.lucidity
  const scrubber = ledit.scrubber
  if (!ledit.lock) {
    ledit.lock = 'scrub'
  }
  e.preventDefault()
  const el = <HTMLElement>e.target
  const sx = e.clientX
  const sy = e.clientY
  // original value
  const sv = scrubber.values[i]
  // original literal (until we save on mouseup)
  const lit = scrubber.literals[i]
  // original line
  const doc = cm.getDoc()
  const oline: string = doc.getLine(lit.line)
  const before = oline.substr(0, lit.ch)
  const after = oline.substr(lit.ch + lit.text.length)
  el.classList.add('scrubbing')
  const sfloat = floatRe.test(el.innerHTML)
  let v: string
  // move callback on global window (like drag)
  const mousemove = (e: MouseEvent) => {
    e.preventDefault()
    const isfloat = (sfloat && !e.shiftKey) || e.altKey
    // scale to approx -0.5, 0.5 in comfortable drag zone
    const dx = (e.clientX - sx) / 384 // some magic numbers...
    const dy = -(e.clientY - sy) / 200
    if (isfloat) {
      // FLOAT
      // get dim as approx 10^2 .... 10^-2 .... 10^2
      const dimx = Math.pow(10, Math.abs(6 * dx) - 3)
      const dimy = Math.pow(10, Math.abs(6 * dy) - 3)
      const dist = (dx > 0 ? 1 : -1) * dimx + (dy > 0 ? 1 : -1) * dimy
      v = (sv + dist).toFixed(4)
      scrubber.values[i] = parseFloat(v) // ensures str === live value
    } else {
      // INT
      // get dim as approx 10^2 .... 1 .... 10^2
      const dimx = Math.pow(10, Math.abs(2 * dx))
      const dimy = Math.pow(10, Math.abs(2 * dy))
      const dist = (dx > 0 ? 1 : -1) * dimx + (dy > 0 ? 1 : -1) * dimy
      v = (sv + dist).toFixed(0)
      scrubber.values[i] = parseInt(v)
    }

    el.textContent = v

    try {
      scrubber.init()
    } catch (err) {
      console.log(err)
    }
  }

  const mouseup = (e: any) => {
    window.removeEventListener('mousemove', mousemove)
    window.removeEventListener('mouseup', mouseup)
    // move mouse back
    el.classList.remove('scrubbing')
    document.body.style.cursor = 'auto'
    // end of interaction, incoming sources from save op
    const nline = before + v + after
    const f = { line: lit.line, ch: 0 }
    const t = { line: lit.line, ch: oline.length }
    if (ledit.lock === 'scrub') {
      delete ledit.lock
    }
    doc.replaceRange(nline, f, t)
    saveSource(cm)
  }

  document.body.style.cursor = 'move'
  window.addEventListener('mousemove', mousemove)
  window.addEventListener('mouseup', mouseup)
}

export const compileCode = (source: string, done: TranspileCallback) => {
  // Call 'done' with TranspileCallbackArgs when compilation is finished
  runWork(source, done)
}

let updating = false

// Called by playback when the content is compiled.
export const scrubMark = (cm: CMEditor) => {
  const ledit = cm.options.lucidity
  const scrubber = ledit.scrubber

  if (updating || ledit.noscrub) {
    // update could be called while we update the tree. Avoid.
    return
  }
  updating = true
  // clear previous marks
  const doc = cm.getDoc()
  const marks = doc.getAllMarks()
  for (const m of marks) {
    m.clear()
  }
  ledit.cursorMarkCleared = false

  const literals = scrubber.literals
  if (!literals) {
    updating = false
    return
  }

  for (let i = 0; i < literals.length; ++i) {
    const l = literals[i]
    const span = document.createElement('span')
    span.textContent = l.text
    const start = { line: l.line, ch: l.ch }
    const end = { line: l.line, ch: l.ch + l.text.length }
    span.classList.add('cm-number')
    span.classList.add('scrub')
    const mark = doc.markText(start, end, {
      handleMouseEvents: true,
      replacedWith: span,
      atomic: false,
    })
    CodeMirror.on(mark, 'beforeCursorEnter', () => {
      // mark around cursor are a mess
      ledit.cursorMarkCleared = true
      mark.clear()
    })

    span.addEventListener('mousedown', e => {
      scrubdown(e, i, cm)
    })
  }

  updating = false
}

const scrubSetup =
  // called on new CodeMirror and setOptions
  (cm: CMEditor, opts: any, old: any) => {
    if (opts) {
      cm.options.lucidity = opts
      scrubMark(cm)
    }
  }

const LANG_TO_MODE: { [key: string]: string } = {
  js: 'javascript',
  ts: 'javascript',
  latex: 'stex',
  glsl: 'x-shader/x-vertex',
}
const getMode = (lang: string) => {
  return LANG_TO_MODE[lang] || 'text'
}

export const sourceChanged = (
  cm: CMEditor,
  lang: string,
  source: string,
  blockId: string
) => {
  const ledit = cm.options.lucidity
  if (ledit.lock && ledit.blockId === blockId && ledit.lang === lang) {
    // ignore
    return
  } else if (source === ledit.source && lang === ledit.lang) {
    // ignore
    ledit.blockId = blockId
    return
  } else {
    // prevent save while we update the source
    ledit.nosave = true
    ledit.source = source
    if (lang !== ledit.lang) {
      ledit.lang = lang
      const mode = getMode(lang)
      if (ledit.mode !== mode) {
        ledit.mode = mode
        cm.setOption('mode', mode)
      }
    }
    ledit.blockId = blockId
    cm.setValue(source || '')
    ledit.nosave = false
  }
}

const noScrubToggle = (cm: CMEditor) => {
  const ledit = cm.options.lucidity
  ledit.noscrub = !ledit.noscrub
  if (ledit.noscrub) {
    // clear marks
    const doc = cm.getDoc()
    const marks = doc.getAllMarks()
    for (const m of marks) {
      m.clear()
    }
  } else {
    scrubMark(cm)
  }
}

export const saveSource = (cm: CMEditor) => {
  const ledit = cm.options.lucidity
  const save = ledit.callbacks.onSave

  if (save) {
    // Do not trigger 'save' while we are updating the
    // source through setValue. With 'CMD+S' we probably do not
    // need this.
    if (!ledit.nosave) {
      const source = cm.getValue()
      ledit.source = source
      save(<any>ledit.lang, source)
    }
  }
}

const isLiteral = /[0-9\.]/

interface Callbacks {
  onSave?: (filename: string, source: string) => void
  onBlur?: () => void
  typecheck?: (filename: string, source: string) => void
}

export const makeEditor = (
  elm: HTMLElement,
  source: string = '',
  lang: string,
  callbacks?: Callbacks,
  options: { autofocus?: boolean; keyMap?: 'vim' } = {}
): any => {
  // We copy in here the currently loaded block's scrubber so that
  // we can access it from the editor.
  const scrubber: Scrubber = { js: '', values: [], init() {}, literals: [] }

  const ledit: EditorLucidityOptions = { scrubber, callbacks: callbacks || {} }

  const cmOptions: { [key: string]: any } = {
    autofocus: options.autofocus,
    value: source,
    indentUnit: 2,
    lineWrapping: true,
    theme: 'bespin',
    mode: getMode(lang),
    gutters: ['lucy-gutter'],
    extraKeys: {
      Tab: 'indentMore',
      ['Shift-Tab']: 'indentLess',
      ['Alt-S']: noScrubToggle,
      ['Cmd-S']: saveSource,
      ['Ctrl-S']: saveSource,
    },
    smartIndent: false,
  }
  if (options.keyMap) {
    cmOptions.keyMap = options.keyMap
  }

  // addons
  cmOptions['scrollbarStyle'] = 'overlay'
  cmOptions['lucidity'] = ledit

  const cm = <CMEditor>CodeMirror(elm, cmOptions)

  cm.on('focus', () => {
    ledit.lock = 'focus' // blockId
  })

  cm.on('blur', () => {
    const blur = ledit.callbacks.onBlur
    delete ledit.lock
    if (blur) {
      blur()
    }
    saveSource(cm)
  })

  cm.on('cursorActivity', () => {
    if (ledit.cursorMarkCleared) {
      // Check cursor distance to literal number
      const doc = cm.getDoc()
      const loc = doc.getCursor()
      const before = doc.getRange({ line: loc.line, ch: loc.ch - 1 }, loc)
      const after = doc.getRange(loc, { line: loc.line, ch: loc.ch + 1 })
      if (isLiteral.test(before) || isLiteral.test(after)) {
        // ignore
      } else {
        // mark back
        scrubMark(cm)
      }
    }
  })

  cm.on('changes', () => {
    // Do not trigger 'typecheck' while we are updating the
    // source through setValue.
    if (!ledit.nosave && ledit.mode === 'javascript') {
      // const source = cm.getValue()
      // FIXME
      // callbacks.typecheck ( ledit.filename, source )
      // save ??
      saveSource(cm)
    } else {
      saveSource(cm)
    }
  })

  /*
  setGlobalKey
  ( { Escape ( e ) {
        saveSource ( cm )
        // no preventDefault, let it propagate
      }
    }
  )
  */

  return cm
}

CodeMirror.defineOption('lucidity', {}, scrubSetup)

import * as simple from 'simple-mock'

import * as makeref from './makeRef'
import {
  ChangesType,
  CompositionType,
  OperationType,
  isRangeSelection,
  ElementType,
  SelectionType,
  ChangeType,
} from './types'
import { newComposition, NewCompositionOptions } from '../newComposition'

const composition1: CompositionType = {
  g:
    // Block = PARAGRAPH / MEDIA LEVEL
    {
      para1:
        // position
        {
          p: 0,
          // type <p>
          t: 'P',
          // children or string
          g: {
            span11: {
              p: 0,
              // <span>
              t: 'T',
              i: 'You can click ',
            },
            // Link
            span12: {
              p: 1,
              // <a>
              t: 'A',
              o: {
                href: 'http://example.com',
              },
              g: {
                span121: {
                  p: 0,
                  t: 'T',
                  i: 'this ',
                },
                span122: {
                  p: 1,
                  // <span class='s e'>
                  t: 'B+I',
                  i: 'link ',
                },
              },
            },
            span13: {
              p: 2,
              // <span>
              t: 'T',
              i: 'to view the next ',
            },
            span14: {
              p: 3,
              t: 'I',
              i: 'page',
            },
            span15: {
              p: 4,
              t: 'T',
              i: '.',
            },
          },
        },
      para2: {
        p: 1,
        t: 'P',
        g:
          // Markup = bold, italic, etc
          {
            span21: {
              p: 0,
              t: 'T',
              i: 'This is the first ',
            },
            span22: {
              p: 1,
              t: 'B',
              i: 'message',
            },
            span23: {
              p: 2,
              t: 'T',
              i: '. Hello blah bomgolo frabilou elma tec.',
            },
          },
      },
      para3: {
        p: 2,
        t: 'P',
        i: 'This is the third paragraph. My tailor types fast.',
      },
      para4: {
        p: 3,
        o: { l: 'ol' },
        t: 'P',
        i: 'First point.',
      },
      para5: {
        p: 4,
        o: { l: 'ol' },
        t: 'P',
        i: 'Second point with',
      },
      para6: {
        p: 5,
        o: { l: 'ol' },
        t: 'P',
        i: 'Third point.',
      },
    },
}

export function mockComposition(withCustomPara?: boolean): CompositionType {
  const comp: CompositionType = JSON.parse(MOCK1)
  if (withCustomPara) {
    const para2 = comp.g['para2']
    para2.c = 'X'
    comp.data = { para2: { value: 0.5 } }
    delete para2.g
  }
  return comp
}

export function mockRef(): void {
  let counter = 0
  simple.mock(makeref, 'makeRef').callFn(() => `refe${++counter}`)
}

interface ChangeResults {
  selected: string[]
  updated: string[]
  deleted: string[]
  start: string
  end: string
  selection: string
}

const MOCK1 = JSON.stringify(composition1)

function showRef(change: ChangeType | undefined): string {
  if (!change) {
    return ''
  }
  return showElem(change.path, change.elem)
}

function showElem(path: string[], value?: ElementType): string {
  if (value) {
    const title = value.o && value.o.title ? ':TITLE' : ''
    return value.c
      ? `${path.join('.')} [${value.t}:${value.p}:${value.c}${title}]`
      : `${path.join('.')} [${value.t}:${value.p}${title}] '${value.i}'`
  } else {
    return path.join('.')
  }
}

function showSelection(selection: SelectionType | undefined): string {
  if (!selection) {
    return ''
  }
  if (isRangeSelection(selection)) {
    return `${selection.anchorPath.join('.')}:${
      selection.anchorOffset
    } -> ${selection.focusPath.join('.')}:${selection.focusOffset}`
  } else {
    return `${selection.anchorPath.join('.')}:${selection.anchorOffset}`
  }
}

export function opResults(ops: OperationType[] | undefined): string[] {
  if (!ops) {
    return ['noop']
  }
  return ops.map(op => {
    switch (op.op) {
      case 'update':
        return `[update] ${showElem(op.path, op.value)}`
      case 'delete':
      case 'data':
        return `[${op.op}] ${showElem(op.path)}`
      case 'select':
        return `[select] ${showSelection(op.value)}`
      default:
        return `[${op.op}]`
    }
  })
}

export function changesResults(changes: ChangesType): ChangeResults {
  const { elements } = changes
  const selected = Object.keys(elements).filter(k => elements[k].selected)
  const updated = Object.keys(elements).filter(
    k => elements[k].op === 'update' || elements[k].op === 'create'
  )
  const deleted = Object.keys(elements).filter(k => elements[k].op === 'delete')
  return {
    selected: selected.map(ref => {
      const refElem = elements[ref]
      return (
        (ref === refElem.pathId
          ? ref
          : `BUG! ref '${ref}' ≠ pathId '${refElem.pathId}' `) +
        `-` +
        refElem.elem.t
      )
    }),
    updated: updated.map(ref => {
      const refElem = elements[ref]
      return (
        (ref === refElem.pathId
          ? ref
          : `BUG! ref '${ref}' ≠ pathId '${refElem.pathId}' `) +
        `-` +
        refElem.elem.t +
        ` [${refElem.elem.p}]`
      )
    }),
    deleted: deleted || [],
    start: showRef(changes.start),
    end: showRef(changes.end),
    selection: showSelection(changes.selection),
  }
}

export interface MakeComposition {
  addParagraph(id: string, para: ElementType): MakeComposition
  setData(id: string, data: any): MakeComposition
  done(): CompositionType
}

export function makeComposition(opts: NewCompositionOptions): MakeComposition {
  const comp = newComposition(opts)
  const self: MakeComposition = {
    addParagraph(id, para) {
      comp.g[id] = para
      return self
    },
    setData(id, data) {
      if (!comp.data) {
        comp.data = {}
      }
      comp.data[id] = data
      return self
    },
    done() {
      return comp
    },
  }
  return self
}

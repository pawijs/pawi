import * as ts from 'typescript'
import { CompilerError, LiteralScrub, SCRUBBER_VAR } from './types'
import { CodeMirror } from './CodeMirror'

const UNARY_AFTER = ['=', '(', '?', ':', '[', '*', '/', '+']
const SCRUB_PREFIX = `declare var ${SCRUBBER_VAR}: number[]\n`

const BASE_HOST = {
  getCompilationSettings(): ts.CompilerOptions {
    return {
      target: ts.ScriptTarget.ES2015,
      module: ts.ModuleKind.CommonJS,
    }
  },

  getNewLine(): string {
    return '\n'
  },

  getCurrentDirectory(): string {
    return 'LUCIDITY' // ?
  },

  getDefaultLibFileName(options: ts.CompilerOptions): string {
    return 'lib.d.ts'
  },

  log(s: string): void {
    console.log('LOG', s)
  },

  trace(s: string): void {
    console.log('TRACE', s)
  },

  error(s: string): void {
    console.error('ERROR', s)
  },

  useCaseSensitiveFileNames(): boolean {
    return true
  },

  resolveModuleNames(
    moduleNames: string[],
    containingFile: string
  ): ts.ResolvedModule[] {
    return moduleNames.map(n => ({ resolvedFileName: n }))
    // isExternalLibraryImport?: boolean
  },
}

declare var require: any
const LUCIDITY_D_TS_SOURCE = require('!raw!../../../typings/lucidity/lucidity.d.ts')
const LUCIDITY_D_TS = ts.ScriptSnapshot.fromString(LUCIDITY_D_TS_SOURCE)
const LIB_D_TS_SOURCE = require('!raw!../../../node_modules/typescript/lib/lib.es6.d.ts')
const LIB_D_TS = ts.ScriptSnapshot.fromString(LIB_D_TS_SOURCE)

const D_TS: { [key: string]: any } = {
  ['lucidity']: LUCIDITY_D_TS,
  ['lib.d.ts']: LIB_D_TS,
}

const libShot = (filename: string): ts.IScriptSnapshot => {
  const s = D_TS[filename]
  return s
}

const mainFile = {
  source: '',
  version: 1,
}

// This is used by typesript checker. This provides the type checking environment for scripts.
const LanguageHost = (): ts.LanguageServiceHost => {
  const lh = {
    getScriptFileNames(): string[] {
      return ['main.ts']
    },
    getScriptVersion(filename: string): string {
      if (filename === 'main.ts') {
        return mainFile.version.toString()
      } else {
        return '1.0'
      }
    },

    getScriptSnapshot(filename: string): ts.IScriptSnapshot {
      if (filename === 'main.ts') {
        return ts.ScriptSnapshot.fromString(mainFile.source)
      }
      return libShot(filename)
    },
    // getLocalizedDiagnosticMessages?(): any;
    // getCancellationToken?(): HostCancellationToken;
  }

  return Object.assign(BASE_HOST, lh)
}

export const create = (): ts.LanguageService => {
  // FIXME: Use a DocumentRegistry to at least store types for
  // things like lib.d.ts, lucidity, THREE.js and share them.
  const host = LanguageHost()
  return ts.createLanguageService(host, ts.createDocumentRegistry())
}

const LS = create()

interface CompileReturn {
  js?: string
  errors?: CompilerError[]
}

const addLiteral = (
  literals: LiteralScrub[],
  line: number,
  ch: number,
  text: string
) => {
  if (text.substr(0, 2) === '0x') {
    return null
  }
  const value = parseFloat(text)
  return literals.push({ text, line, ch, value }) - 1
}

export const scrubParse = (
  source: string,
  literals: LiteralScrub[],
  mode: string = 'javascript'
): string | undefined => {
  const output: any[] = []
  let line = 0
  let ch = 0
  const CM = <any>CodeMirror // this is annoying
  CM.runMode(source, mode, (text: any, klass: any) => {
    if (text === '\n') {
      ++line
      ch = 0
      output.push(text)
    } else {
      if (klass === 'number') {
        // const foo = 4 - 5
        const idx = addLiteral(literals, line, ch, text)
        if (idx === null) {
          // Not a value we can handle
          output.push(text)
        } else {
          let p = output.length - 1
          let uch = ''
          let unarypos = null
          let getMinus = true

          while (true) {
            const op = output[p]
            if (op[0] === ' ') {
              // whitespace
              if (getMinus) {
                uch = op + uch
              }

              --p
            } else if (getMinus) {
              if (op === '-') {
                getMinus = false
                unarypos = p
                uch = op + uch
                --p
              } else {
                // not unary minus
                break
              }
            } else if (UNARY_AFTER.indexOf(op) >= 0) {
              break
            } else {
              unarypos = null
              break
            }
          }

          const s = `${SCRUBBER_VAR}[${idx}]`
          if (unarypos) {
            // unary minus
            while (output.length > unarypos) {
              output.pop()
            }
            output.push(s)
            // make unary
            const l = literals[idx]
            l.value = -l.value
            l.text = uch + l.text
            l.ch -= uch.length
          } else {
            output.push(s)
          }
        }
      } else {
        output.push(text)
      }
      ch += text.length
    }
  })
  const newsource = output.join('')
  const { errors, js } = compile(SCRUB_PREFIX + newsource)
  // should not generate compilation errors
  if (errors) {
    console.log('scrubParse compilation error', errors)
  }
  return js
}

export const compile = (
  source: string,
  typecheck: boolean = true
): CompileReturn => {
  mainFile.source = source
  mainFile.version++
  // First check for errors
  let diagnostics: any[] = []
  if (typecheck) {
    // Type checking should happen in web worker
    // and we send back errors with a signal: easy.
    // http://www.html5rocks.com/en/tutorials/workers/basics/
    diagnostics =
      // This doesn't seem to give any useful information.
      // [ ...LS.getCompilerOptionsDiagnostics ()
      [
        ...LS.getSyntacticDiagnostics('main.ts'),
        ...LS.getSemanticDiagnostics('main.ts'),
      ]
  }

  if (diagnostics.length > 0) {
    let errors = diagnostics.map(d => {
      const message = ts.flattenDiagnosticMessageText(d.messageText, '\n')
      if (d.file) {
        const { line, character } = d.file.getLineAndCharacterOfPosition(
          d.start
        )
        return { line, ch: character, message }
      } else {
        return { line: 0, ch: 0, message }
      }
    })
    return { errors }
  }

  const output = LS.getEmitOutput('main.ts')
  if (!output.emitSkipped) {
    // valid
    const js = output.outputFiles[0].text
    return { js }
  } else {
    // FIXME: Improve this error message
    const error = {
      message: 'Could not compile (emitSkipped).',
      line: 0,
      ch: 0,
    }
    return { errors: [error] }
  }
}

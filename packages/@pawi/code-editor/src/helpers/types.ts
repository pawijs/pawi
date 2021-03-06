export const SCRUBBER_VAR = '$scrub$'

export interface LiteralScrub {
  value: number
  text: string
  ch: number
  line: number
}

export interface CMOptions {
  lucidity: EditorLucidityOptions
}

export interface CMEditor extends CodeMirror.Editor {
  options: CMOptions
}

interface EditorLucidityOptions {
  scrubber: Scrubber
  lock?: string
  noscrub?: boolean
  blockId?: string // to detect change of block selection
  cursorMarkCleared?: boolean
  nosave?: boolean
}

export interface Scrubber extends ScrubCode {
  // Call init on block if value changes
  init?: any
}

export interface ScrubCode {
  js: string
  values: number[]
  literals: LiteralScrub[]
}

export interface CompilerError {
  message: string
  line: number
  ch: number
}

export interface TranspileCallbackArgs {
  js: string
  scrub: ScrubCode
  errors: CompilerError[]
}

export interface TranspileCallback {
  ({ js, scrub, errors }: TranspileCallbackArgs): void
}

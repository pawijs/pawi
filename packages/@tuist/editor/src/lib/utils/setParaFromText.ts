import { OperationsKey } from '../doOperation'
import { EditorProvider, ParagraphPayload } from './types'

export function setParaFromText(
  options: EditorProvider,
  start: string
): { opts: any; op: OperationsKey } | undefined {
  if (start.length > 4) {
    return
  }
  // replace insecable space with space
  const str = start.replace(' ', ' ')
  const para = options.startText[str]
  if (para) {
    const opts: ParagraphPayload = JSON.parse(para.payload)
    opts.i = ''
    return { opts, op: para.op }
  }
  return
}

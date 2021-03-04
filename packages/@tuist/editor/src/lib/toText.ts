import { toHTML } from './toHTML'
import { CompositionType } from './utils/types'

export function toText(composition: CompositionType): string {
  const html = toHTML(composition)
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

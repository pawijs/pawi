import {
  CompositionType,
  ElementType,
  isGroupElement,
  isListItem,
  isStringElement,
} from './utils/types'

import { getElementClassName } from '../components/helpers/getElementClassName'
import { getElementTag } from '../components/helpers/getElementTag'

// TODO: Maybe we should use STRONG and EM instead of styles.
function elemToHTML(
  elem: ElementType,
  isParagraph: boolean
): { html: string; listType?: string } {
  if (isStringElement(elem)) {
    if (isParagraph) {
      const tag = getElementTag(elem)
      const html = `<${tag}>${elem.i}</${tag}>\n`
      if (isListItem(elem)) {
        return { html, listType: elem.o!.l }
      }
      return { html }
    } else if (elem.t === 'E') {
      return { html: `<br/>\n` }
    } else {
      const klass = getElementClassName(elem) || ''
      if (klass.includes('strong') && klass.includes('em')) {
        return { html: `<strong><em>${elem.i}</em></strong>` }
      } else if (klass.includes('strong')) {
        return { html: `<strong>${elem.i}</strong>` }
      } else if (klass.includes('em')) {
        return { html: `<em>${elem.i}</em>` }
      }
      return { html: elem.i }
    }
  } else if (isGroupElement(elem)) {
    const tag = getElementTag(elem)
    const html = `<${tag}>${Object.keys(elem.g)
      .map(key => elemToHTML(elem.g[key], false).html)
      .join('')}</${tag}>\n`
    if (isListItem(elem)) {
      return { html, listType: elem.o!.l }
    }
    return { html }
  } else {
    // Custom paragraph. Ignore.
    return { html: '' }
  }
}

export function toHTML(composition: CompositionType): string {
  const children = Object.keys(composition.g).map(key => composition.g[key])

  let lastList: string | undefined
  const result: string[] = ['<html><body>\n']
  for (const elem of children) {
    const { html, listType } = elemToHTML(elem, true)
    if (lastList !== listType) {
      if (lastList) {
        result.push(`</${lastList}>\n`)
      }
      lastList = listType
      if (listType) {
        result.push(`<${listType}>\n`)
      }
    }
    result.push(html)
  }
  if (lastList) {
    result.push(`</${lastList}>\n`)
  }
  result.push('</body></html>')
  return result.join('')
}

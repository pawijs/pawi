import { addParagraph, emptyComposition, addSpan } from './newComposition'
import {
  CompositionType,
  ElementType,
  GroupElementType,
  isStringElement,
  Type,
} from './utils/types'

const parser = new DOMParser()

const TAGNAME_TO_TYPE: { [key: string]: Type } = {
  STRONG: 'B',
  EM: 'I',
}

const TAGNAME_TO_LIST: { [key: string]: string } = {
  OL: 'ol',
  UL: 'ul',
}

function parseElement(
  comp: CompositionType,
  base: ElementType | undefined,
  baseParent: GroupElementType,
  elem: HTMLElement,
  baseList: 'ol' | 'ul' = 'ul'
) {
  const tag = elem.tagName

  let current = base
  let parent = baseParent
  let list = baseList

  const l = TAGNAME_TO_LIST[tag] as typeof list
  const t = TAGNAME_TO_TYPE[tag]
  if (tag === 'P') {
    // create paragraph
    current = addParagraph(comp, 'P')
  } else if (tag === 'LI') {
    current = addParagraph(comp, 'P')
    current.o = { l: list }
  } else if (l) {
    list = l
  } else if (t) {
    if (!current) {
      console.error('Cannot add span without current paragraph.')
      return
    }
    if (current.t === 'B' || current.t === 'I') {
      // Combine
      current = addSpan(parent, [t, current.t].sort().join('+') as Type)
    } else {
      parent = current as GroupElementType
      current = addSpan(current, TAGNAME_TO_TYPE[tag])
    }
  } else if (tag === 'BR') {
    if (current) {
      current = addSpan(current, 'E')
    } else {
      addParagraph(comp, 'P')
    }
    return
  } else if (tag === 'BODY') {
    // do nothing
  } else {
    console.log(`Invalid tagname '${tag}' (ignored).`)
    return
  }

  // BODY, P, STRONG, EM, OL, UL, LI, ...

  // BODY = 'newComposition' => comp (wrapped comp)
  // P = 'addParagraph' => para (wrapped elem)
  // STRONG = 'addSpan...' => span (wrapped elem)
  // CLOSE = 'elem.parent'
  // p, strong, em, ol, ul, li
  for (const child of Array.from(elem.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      if (current) {
        let span = current
        if (!isStringElement(span)) {
          span = addSpan(span, 'T')
        }
        span.i = child.textContent || ''
      } else if (tag === 'BODY') {
        // ignore
      } else {
        // spacing text: ignore
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      parseElement(comp, current, parent, child as HTMLElement, list)
    }
  }
}

export function fromHTML(html: string) {
  const comp = emptyComposition()
  const doc = parser.parseFromString(html, 'text/html')
  const body = doc.querySelector('body')
  if (body) {
    parseElement(comp, undefined, comp as GroupElementType, body)
  }
  return comp
}

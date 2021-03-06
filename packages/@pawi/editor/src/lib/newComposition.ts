import { caretSelection } from './utils/caretSelection'
import * as makeref from './utils/makeRef'
import { addDepth } from './utils/mergeElements'
import {
  CompositionType,
  ElementType,
  isGroupElement,
  isStringElement,
  StringElementType,
  Type,
} from './utils/types'

export interface NewCompositionOptions {
  id?: string
  title?: string | boolean
  paragraphs?: (string | Partial<ElementType>)[]
  select?: boolean
}

export function emptyComposition(): CompositionType {
  return { g: {} }
}

export function newComposition(
  opts: NewCompositionOptions = {}
): CompositionType {
  const id =
    opts.id ||
    // Extra indirection to enable mock during testing
    makeref.makeRef()
  const { title, paragraphs } = opts
  const hasTitle = typeof title === 'string' || title === true
  const titleValue = typeof title === 'string' ? title : ''
  const elem: ElementType = {
    t: 'P',
    i: titleValue,
    p: 0,
    s: caretSelection([id], 0),
  }
  if (hasTitle) {
    elem.o = { h: 1, title: true }
  }
  const comp = {
    g: {
      [id]: elem,
    },
    spath: id,
  }

  if (paragraphs) {
    paragraphs.forEach(para => {
      addParagraph(comp, 'P', para)
    })
  }

  if (opts.select) {
    comp.spath = id
    comp.g[id].s = caretSelection([id], titleValue.length)
  }
  return comp
}

export function addParagraph(
  comp: CompositionType,
  t: Type = 'P',
  content: string | Partial<ElementType> = ''
): ElementType {
  const id = makeref.makeRef()
  const p = Math.max(-1, ...Object.values(comp.g).map(e => e.p)) + 1
  const elem: ElementType =
    typeof content === 'string'
      ? ({ t, i: content, p } as StringElementType)
      : Object.assign({}, content, { t, p })
  comp.g[id] = elem
  return elem
}

export function addSpan(base: ElementType, t: Type = 'T'): StringElementType {
  if (isGroupElement(base)) {
    const g = base.g
    const id = makeref.makeRef()
    const p = Math.max(-1, ...Object.values(g).map(e => e.p)) + 1
    const elem: StringElementType = { t, i: '', p }
    g[id] = elem
    return elem
  } else if (isStringElement(base)) {
    return addSpan(addDepth(base, true), t)
  }
  throw new Error('Cannot add span to non string element.')
}

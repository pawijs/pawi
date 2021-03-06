import { ParagraphOptions } from './options'
import { Selection } from './selection'

export type TypeName = 'P' | 'A' | 'E' | 'T' | 'B' | 'I' | 'B+I'
export const TYPES: TypeName[] = ['P', 'A', 'E', 'T', 'B', 'I', 'B+I']

export interface BaseElement extends ParagraphOptions {
  // Type
  t: TypeName
  // Position
  p: number
  // Inner content (string)
  i?: string
  // Selection
  s?: Selection
  // Group
  g?: Elements
  // Temporary
  noFuse?: boolean
}

export interface StringElement extends BaseElement {
  i: string
}

export interface GroupElement extends BaseElement {
  g: Elements
}

export interface CustomElement extends BaseElement {
  c: string
}

export function isStringElement(elem: Element): elem is StringElement {
  return typeof elem.i === 'string'
}

export function isGroupElement(elem: Element): elem is GroupElement {
  return typeof elem.g === 'object'
}

export function isCustomElement(elem: Element): elem is CustomElement {
  return typeof elem.c === 'string'
}

export type Element = StringElement | GroupElement | CustomElement

export interface Elements {
  [key: string]: Element
}

export interface ElementRef {
  path: string[]
  elem: Element
  // Flag set when selecting a range to detect anchor element in range
  anchor?: boolean
  // Flag set when selecting a range to detect focus element in range
  focus?: boolean
}

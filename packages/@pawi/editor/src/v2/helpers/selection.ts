import {
  CaretSelection,
  ElementRef,
  Mutation,
  Position,
  RangeSelection,
  Selection,
} from '../types'
import { atPath } from './atPath'
import { lastDescendant } from './children'

const DUMMY_POSITION = { top: 0, left: 0 }

export function anchorElement(m: Mutation): ElementRef | undefined {
  const { spath } = m.comp
  if (spath !== undefined) {
    const path = spath.split('.')
    const elem = atPath(m, path)
    if (elem) {
      return { elem, path }
    }
  }
  return undefined
}

export function getSelection(m: Mutation): Selection | undefined {
  const { spath } = m.comp
  if (!spath) {
    return undefined
  }
  const elem = atPath(m, spath.split('.'))
  return (elem && elem.s) || undefined
}

export function endCaretSelection(ref: ElementRef): CaretSelection {
  const last = lastDescendant(ref)
  return caretSelection(last.path, last.elem.i ? last.elem.i.length : 0)
}

export function rangeSelection(
  anchorPath: string[],
  anchorOffset: number,
  focusPath: string[],
  focusOffset: number,
  position: Position = DUMMY_POSITION
): RangeSelection {
  return {
    type: 'Range',
    anchorPath,
    anchorOffset,
    focusPath,
    focusOffset,
    position,
  }
}

export function caretSelection(
  path: string[],
  offset: number,
  position: Position = DUMMY_POSITION
): CaretSelection {
  return {
    type: 'Caret',
    anchorPath: path,
    anchorOffset: offset,
    position,
  }
}

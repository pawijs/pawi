import {
  ElementRef,
  Mutation,
  RangeSelection,
  Selection,
  isGroupElement,
  isRangeSelection,
} from '../types'
import { addDepth, newElement, simplify } from '.'
import {
  atPath,
  caretSelection,
  inSelection,
  rangeSelection,
  sortAscending,
} from '../helpers'

import { isCustomElement } from '../../lib'
import { setSelection } from '../mutations'

function flatten(refList: ElementRef[]): ElementRef[] {
  const result: ElementRef[] = []
  for (const ref of refList) {
    const { path, elem } = ref
    if (isGroupElement(elem)) {
      const { g } = elem
      result.push(
        ...flatten(
          sortAscending(g).map(k => ({ path: [...path, k], elem: g[k] }))
        )
      )
    } else {
      result.push(ref)
    }
  }
  return result
}

export function applyToRange(
  m: Mutation,
  updateSelection: boolean,
  s: RangeSelection,
  op: (refs: ElementRef[]) => void
) {
  const sel = inSelection(m, s)
  let ns: Selection = { ...s }
  let lockRef: ElementRef | undefined
  const refs: ElementRef[] = []
  const roots: string[] = []
  flatten(sel).forEach(r => {
    if (isCustomElement(r.elem)) {
      refs.push(r)
      return
    }
    if (!roots.includes(r.path[0])) {
      roots.push(r.path[0])
    }
    if (r.path.length === 1) {
      // Cannot apply style to root paragraph: rule (7)
      const child = addDepth(m, r.elem)
      if (!child) {
        return
      }
      r.elem = child.elem
      r.path = [...r.path, child.id]
    }
    if (
      (r.anchor && s.anchorOffset > 0) ||
      (r.focus && s.focusOffset < r.elem.i!.length)
    ) {
      // Partial change. Divide element from selection range.
      const parent = atPath(m, r.path.slice(0, -1))
      if (!parent || !isGroupElement(parent)) {
        return
      }
      const i = r.elem.i || ''
      const before = r.anchor ? i.slice(0, s.anchorOffset) : ''
      const after = r.focus ? i.slice(s.focusOffset) : ''
      const inside = i.slice(before.length, i.length - after.length)

      if (before.length) {
        const ref = newElement(m, r)
        if (!ref) {
          return
        }
        ref.elem.t = r.elem.t
        r.elem.i = before
        ref.elem.i = inside
        r = { ...r, ...ref } // copy focus/anchor
      } else {
        // no before
        r.elem.i = inside
      }
      if (after.length) {
        const ref = newElement(m, r)
        if (!ref) {
          return
        }
        ref.elem.i = after
      }
    }
    if (r.elem.i!.length === 0) {
      r.elem.noFuse = true
      lockRef = r
    }
    refs.push(r)
    if (r.anchor && r.focus) {
      const i = r.elem.i!
      if (i.length === 0) {
        ns = caretSelection(r.path, 0)
      } else {
        ns = rangeSelection(r.path, 0, r.path, r.elem.i!.length)
      }
    } else {
      if (r.anchor) {
        ns.anchorPath = r.path
        ns.anchorOffset = 0
      }
      if (r.focus && isRangeSelection(ns)) {
        ns.focusPath = r.path
        ns.focusOffset = r.elem.i!.length
      }
    }
  })
  op(refs)
  if (updateSelection) {
    // This must be done before simplify since simplify takes care
    // of preserving selection.
    setSelection(m, ns)
  }
  // This is in case a selection spans many paragraphs and we
  // need to preserve it during simplification.
  const sh: { s?: RangeSelection } = {}
  roots.forEach(id => simplify(m, sh, id))
  // 'sh' should be resolved by now, so no need to check.
  if (lockRef) {
    delete lockRef.elem.noFuse
  }
  return ns
}

import {
  GroupElement,
  Mutation,
  RangeSelection,
  Selection,
  StringElement,
  isCaretSelection,
} from '../types'
import { caretSelection, isStringElement } from '../../lib'
import { rangeSelection, sortAscending } from '../helpers'

import { setSelection } from './setSelection'

function shouldFuse(a: StringElement, b: StringElement) {
  return b.t === a.t || (b.i.length === 0 && b.t !== 'E' && !b.noFuse)
}

export function simplify(
  m: Mutation,
  sh: { s?: RangeSelection; root?: string; id?: string },
  paraId: string
) {
  const elem = m.comp.g[paraId] as GroupElement
  // console.log('simplify', JSON.stringify(elem, null, 2), '\n\n\n\n')
  const { g } = elem
  const ids = sortAscending(g)
  let c: StringElement | undefined
  let cid: string | undefined
  let endSel: RangeSelection | undefined
  let startSel: Selection | undefined
  for (let i = 0; i < ids.length; ++i) {
    const id = ids[i]
    const e = g[id]
    if (!isStringElement(e)) {
      return
    }
    if (c && cid && shouldFuse(c, e)) {
      c.i! += e.i!
      const { s } = e
      if (s) {
        if (isCaretSelection(s)) {
          // Caret selection
          startSel = caretSelection(
            [...s.anchorPath.slice(0, -1), cid],
            c.i.length - e.i.length
          )
        } else {
          // Range selection
          delete e.s
          startSel = rangeSelection(
            [...s.anchorPath.slice(0, -1), cid],
            c.i.length - e.i.length,
            s.focusPath,
            s.focusOffset
          )
          sh.s = startSel
          sh.root = s.focusPath[0]
          sh.id = s.focusPath[s.focusPath.length - 1]
        }
      }
      if (sh.s && sh.root === paraId && sh.id === id) {
        // End range selection
        sh.s.focusPath = [...sh.s.anchorPath.slice(0, -1), cid]
        sh.s.focusOffset = c.i.length
        endSel = sh.s
      }
      delete g[id]
    } else {
      c = e
      cid = id
      if (c.s) {
        startSel = c.s
      }
      if (sh.s && sh.root === paraId && sh.id === id) {
        // End range selection
        endSel = sh.s
      }
    }
  }
  if (Object.keys(g).length === 1 && c && c.t === 'T') {
    const e = elem as StringElement
    e.i = c.i
    delete e.g
    if (startSel) {
      // Selection started in paragraph. Update anchor.
      startSel.anchorPath = startSel.anchorPath.slice(0, -1)
    }
    if (endSel) {
      // Selection ended in paragraph. Update focus.
      endSel.focusPath = endSel.focusPath.slice(0, -1)
    }
  }
  if (endSel) {
    setSelection(m, endSel)
    delete sh.s
  } else if (startSel && isCaretSelection(startSel)) {
    setSelection(m, startSel)
  }
}

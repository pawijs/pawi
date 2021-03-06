import { unproxy } from '@pawi/build'
import { inSelection } from './utils/inSelection'
import {
  ChangeType,
  CompositionType,
  GroupElementType,
  isCustomElement,
  isStringElement,
  RangeSelectionType,
} from './utils/types'

function getElem(
  ref: ChangeType,
  isStart: boolean,
  isEnd: boolean,
  selection: RangeSelectionType
) {
  const elem = unproxy(ref.elem)
  if (isStringElement(elem)) {
    if (isStart) {
      elem.i = elem.i.slice(selection.anchorOffset)
    } else if (isEnd) {
      elem.i = elem.i.slice(0, selection.focusOffset)
    }
    if (elem.o && elem.o.title) {
      // Make sure the title is not copied in clipboard
      delete elem.o.title
    }
  }
  return elem
}

export function extractComposition(
  composition: CompositionType,
  selection: RangeSelectionType
): CompositionType {
  const touched = inSelection(composition, selection)
  const start = touched[0]
  const end = touched[touched.length - 1]
  const comp: CompositionType = { g: {} }
  for (const ref of touched) {
    if (ref.path.length > 1) {
      // TODO
      const id = ref.path[0]
      let group = comp.g[id] as GroupElementType
      if (!group) {
        group = Object.assign({}, composition.g[id], { g: {} })
        comp.g[id] = group
      }
      const sid = ref.path[1]
      if (ref.path.length > 2) {
        // sub-group...
        console.error(ref)
      } else {
        group.g[sid] = getElem(ref, ref === start, ref === end, selection)
      }
    } else {
      // Add to composition
      const elem = getElem(ref, ref === start, ref === end, selection)
      comp.g[ref.path[0]] = elem
      if (isCustomElement(elem) && composition.data) {
        if (!comp.data) {
          comp.data = {}
        }
        comp.data[ref.path[0]] = composition.data[ref.path[0]]
      }
    }
  }
  return comp
}

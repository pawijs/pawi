import { getAtPath } from './utils/getAtPath'
import { isParagraphStart } from './utils/isParagraphStart'
import {
  CompositionType,
  isCustomElement,
  isDocumentTitle,
  OperationType,
  SelectionType,
} from './utils/types'

/** Return toolbox and selection operations related to selection changes.
 */
export function doSelect(
  composition: CompositionType,
  selection: SelectionType,
  ops: OperationType[] = []
) {
  const { type, anchorPath, anchorOffset, anchorValue, position } = selection

  const elem = getAtPath(composition, anchorPath)
  if (!elem) {
    console.log(composition)
    console.log(`Invalid anchorPath '${anchorPath}'.`)
    return []
  }

  delete selection.anchorValue

  ops.push({
    op: 'select',
    value: selection,
  })

  if (isCustomElement(elem) || isDocumentTitle(elem)) {
    // no toolbox
    ops.push({ op: 'toolbox' })
  } else {
    if (type === 'Caret') {
      if (
        isParagraphStart(composition, anchorPath, anchorOffset, anchorValue)
      ) {
        if (elem && elem.i === '') {
          ops.push({
            op: 'toolbox',
            value: { type: 'emptyParagraph', position },
          })
        } else {
          ops.push({
            op: 'toolbox',
            value: { type: 'paragraph', position },
          })
        }
      } else {
        ops.push({
          op: 'toolbox',
        })
      }
    } else if (type === 'Range') {
      ops.push({
        op: 'toolbox',
        value: { type: 'selection', position },
      })
    }
  }

  return ops
}

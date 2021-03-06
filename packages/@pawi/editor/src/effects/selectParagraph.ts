import { CompositionType, SelectOperationType } from '../lib/utils/types'

import { caretSelection } from '../lib'
import { processSelect } from './processOps'

// FIXME: IS THIS STILL USED ??? REMOVE.
export function selectParagraph(args: {
  id: string
  composition: CompositionType
}) {
  const { id, composition } = args
  const { spath } = composition
  if (spath && spath === id) {
    // done
  } else {
    const op: SelectOperationType = {
      op: 'select',
      value: caretSelection([id], 0),
    }
    processSelect(composition, op)
    delete composition.toolbox
  }
}

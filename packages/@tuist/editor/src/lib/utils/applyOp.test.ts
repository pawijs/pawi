import { describe, expect, it } from 'test'

import { applyOp } from './applyOp'
import { extractSelection } from './extractSelection'
import { rangeSelection } from './rangeSelection'
import { changesResults, mockComposition, mockRef } from './testUtils'

const composition = mockComposition()

describe('applyOp', () => {
  it('extracts simple selection in plain paragraph', () => {
    mockRef()
    const selection = rangeSelection(['para3'], 12, ['para3'], 17)
    const changes = extractSelection(composition, selection)
    expect(changesResults(applyOp(changes, 'B'))).toEqual({
      selected: ['para3.refe2-B'],
      updated: [
        'para3-P [2]',
        'para3.refe1-T [0]',
        'para3.refe2-B [1]',
        'para3.refe3-T [2]',
      ],
      end: "para3.refe3 [T:2] ' paragraph. My tailor types fast.'",
      start: "para3.refe1 [T:0] 'This is the '",
      selection: '',
      deleted: [],
    })
  })
})

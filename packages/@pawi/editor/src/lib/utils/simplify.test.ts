import { describe, expect, it } from 'test'

import { applyOp } from './applyOp'
import { extractSelection } from './extractSelection'
import { rangeSelection } from './rangeSelection'
import { simplify } from './simplify'
import { changesResults, mockComposition } from './testUtils'

const composition = mockComposition()

describe('simplify', () => {
  it('merges same elements', () => {
    const selection = rangeSelection(
      ['para2', 'span22'],
      0,
      ['para2', 'span22'],
      7
    )
    const rawChanges = applyOp(extractSelection(composition, selection), 'B')

    const simplified = simplify(composition, rawChanges)
    expect(changesResults(simplified).updated).toEqual(['para2-P [1]'])

    expect(simplified.elements['para2'].elem.i).toEqual(
      // All fused in parent
      'This is the first message. Hello blah bomgolo frabilou elma tec.'
    )
  })
})

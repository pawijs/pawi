import { describe, expect, it } from 'test'

import { getPosition } from './getPosition'
import { mockComposition } from './testUtils'

const composition = mockComposition()

describe('getPosition', () => {
  it('converts path into position', () => {
    const path = ['para3']
    expect(getPosition(composition, path)).toEqual([2.0])
  })

  it('converts nested path into position', () => {
    const path = ['para1', 'span12', 'span122']
    expect(getPosition(composition, path)).toEqual([0.0, 1.0, 1.0])
  })
})

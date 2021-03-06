import { describe, expect, it } from 'test'

import { getSiblings } from './getSiblings'
import { mockComposition } from './testUtils'

const composition = mockComposition()

describe('getSiblings', () => {
  it('return null for last element in parent', () => {
    const path = ['para2', 'span23']
    expect(
      getSiblings(composition, path).map(e => (e && e.path) || null)
    ).toEqual([['para2', 'span22'], null])
  })
})

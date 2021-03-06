import { describe, expect, it } from 'test'

import { getNeighbours } from './getNeighbours'
import { mockComposition } from './testUtils'
import { CompositionType } from './types'

const composition = mockComposition()

function doTest(
  comp: CompositionType,
  path: string[]
): (string | null)[] {
  return getNeighbours(composition, path).map(
    e => (e ? e.path.join('.') : null)
  )
}

describe('getNeighbours', () => {
  it('finds neighbours at root level', () => {
    const path = ['para2']
    expect(doTest(composition, path)).toEqual(['para1.span15', 'para3'])
  })

  it('finds next neighbour across levels', () => {
    const path = ['para1', 'span12', 'span122']
    expect(doTest(composition, path)).toEqual([
      'para1.span12.span121',
      'para1.span13',
    ])
  })

  it('finds prev neighbour across levels', () => {
    const path = ['para1', 'span12', 'span121']
    expect(doTest(composition, path)).toEqual([
      'para1.span11',
      'para1.span12.span122',
    ])
  })

  it('finds prev neighbour up across levels', () => {
    const path = ['para3']
    expect(doTest(composition, path)).toEqual(['para2.span23', 'para4'])
  })
})

import { describe, expect, it } from 'test'
import { extractComposition } from './extractComposition'
import { mockComposition } from './utils/testUtils'
import { rangeSelection } from './utils/rangeSelection'
import { StringElementType, GroupElementType } from './utils/types'

const composition = mockComposition()
const position = { top: 0, left: 0 }

describe('extractComposition', () => {
  const para2 = composition.g.para2 as GroupElementType
  const para3 = composition.g.para3 as StringElementType
  const para4 = composition.g.para4 as StringElementType
  it('should extract full paragraphs', () => {
    expect(
      extractComposition(
        composition,
        rangeSelection(['para3'], 0, ['para4'], 12, position)
      )
    ).toEqual({
      g: {
        para3,
        para4,
      },
    })
  })

  it('should extract partial simple paragraphs', () => {
    expect(
      extractComposition(
        composition,
        rangeSelection(['para3'], 8, ['para4'], 5, position)
      )
    ).toEqual({
      g: {
        para3: Object.assign({}, para3, { i: para3.i.slice(8) }),
        para4: Object.assign({}, para4, { i: para4.i.slice(0, 5) }),
      },
    })
  })

  it('should extract group paragraphs', () => {
    expect(
      extractComposition(
        composition,
        rangeSelection(['para2', 'span21'], 8, ['para4'], 5, position)
      )
    ).toEqual({
      g: {
        para2: Object.assign({}, para2, {
          g: {
            span21: Object.assign({}, para2.g.span21, {
              i: para2.g.span21.i!.slice(8),
            }),
            span22: para2.g.span22,
            span23: para2.g.span23,
          },
        }),
        para3,
        para4: Object.assign({}, para4, { i: para4.i.slice(0, 5) }),
      },
    })
  })
})

import { describe, expect, it } from 'test'
import { toHTML } from './toHTML'
import { mockComposition } from './utils/testUtils'
import { rangeSelection } from './utils/rangeSelection'
import {
  StringElementType,
  GroupElementType,
  CompositionType,
  RangeSelectionType,
} from './utils/types'
import { extractComposition } from './extractComposition'

const composition = mockComposition()
const position = { top: 0, left: 0 }

function testToHTML(
  composition: CompositionType,
  selection: RangeSelectionType
): string[] {
  return toHTML(extractComposition(composition, selection)).split('\n')
}

describe('toHTML', () => {
  const para2 = composition.g.para2 as GroupElementType
  const para3 = composition.g.para3 as StringElementType
  const para4 = composition.g.para4 as StringElementType
  it('should extract full paragraphs', () => {
    expect(
      testToHTML(
        composition,
        rangeSelection(['para3'], 0, ['para4'], 12, position)
      )
    ).toEqual([
      '<html><body>',
      `<p>${para3.i}</p>`,
      '<ol>',
      `<li>${para4.i}</li>`,
      '</ol>',
      '</body></html>',
    ])
  })

  it('should extract partial simple paragraphs', () => {
    expect(
      testToHTML(
        composition,
        rangeSelection(['para3'], 8, ['para4'], 5, position)
      )
    ).toEqual([
      '<html><body>',
      `<p>${para3.i.slice(8)}</p>`,
      '<ol>',
      `<li>${para4.i.slice(0, 5)}</li>`,
      '</ol>',
      '</body></html>',
    ])
  })

  it('should extract group paragraphs', () => {
    expect(
      testToHTML(
        composition,
        rangeSelection(['para2', 'span21'], 8, ['para4'], 5, position)
      )
    ).toEqual([
      '<html><body>',
      `<p>${para2.g.span21.i!.slice(8)}<strong>${para2.g.span22.i}</strong>${
        para2.g.span23.i
      }</p>`,
      `<p>${para3.i}</p>`,
      `<ol>`,
      `<li>${para4.i.slice(0, 5)}</li>`,
      `</ol>`,
      '</body></html>',
    ])
  })
})

import { describe, expect, it } from 'test'

import { inSelection } from './inSelection'
import { rangeSelection } from './rangeSelection'
import { mockComposition } from './testUtils'

const composition = mockComposition()

describe('inSelection', () => {
  it('extracts selected elements', () => {
    const selection = rangeSelection(
      ['para1', 'span12', 'span122'],
      2,
      ['para3'],
      20
    )
    expect(
      inSelection(composition, selection).map(e => e.path.join('.'))
    ).toEqual([
      'para1.span12.span122',
      'para1.span13',
      'para1.span14',
      'para1.span15',
      'para2.span21',
      'para2.span22',
      'para2.span23',
      'para3',
    ])
  })

  it('extracts selected elements in local selection accross markup', () => {
    const selection = rangeSelection(
      ['para2', 'span21'],
      12,
      ['para2', 'span23'],
      13
    )
    expect(
      inSelection(composition, selection).map(e => e.path.join('.'))
    ).toEqual(['para2.span21', 'para2.span22', 'para2.span23'])
  })

  it('extracts selected elements three levels deep', () => {
    const selection = rangeSelection(
      ['para1', 'span12', 'span122'],
      2,
      ['para2', 'span23'],
      35
    )
    expect(
      inSelection(composition, selection).map(e => e.path.join('.'))
    ).toEqual([
      'para1.span12.span122',
      'para1.span13',
      'para1.span14',
      'para1.span15',
      'para2.span21',
      'para2.span22',
      'para2.span23',
    ])
  })

  it('returns single element', () => {
    const selection = rangeSelection(
      ['para1', 'span12', 'span122'],
      2,
      ['para1', 'span12', 'span122'],
      2
    )
    expect(
      inSelection(composition, selection).map(e => e.path.join('.'))
    ).toEqual(['para1.span12.span122'])
  })
})

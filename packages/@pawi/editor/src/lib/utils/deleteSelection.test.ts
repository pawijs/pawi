import { describe, expectOps, it } from 'test'
import { deleteSelectionOps } from './deleteSelection'
import { rangeSelection } from './rangeSelection'
import { mockComposition } from './testUtils'

const composition = mockComposition()

describe('deleteSelection', () => {
  it('removes selected text in simple selection', () => {
    const selection = rangeSelection(
      ['para2', 'span22'],
      1,
      ['para2', 'span22'],
      4
    )
    expectOps(deleteSelectionOps(composition, selection)).toEqual([
      "[para2.span22] => 'mage'",
      '[para2.span22:1]',
    ])
  })

  it('should merge string elements in wide selection without fuse', () => {
    const selection = rangeSelection(
      ['para1', 'span12', 'span122'],
      2,
      ['para3'],
      17
    )
    expectOps(deleteSelectionOps(composition, selection)).toEqual([
      '[para1.span13] => ø',
      '[para1.span14] => ø',
      '[para1.span15] => ø',
      '[para3] => ø',
      '[para2] => ø',
      "[para1.span12.span122] => 'li'",
      "[para1.para3] => ' paragraph. My tailor types fast.'",
      '[para1.span12.span122:2]',
    ])
  })

  it('should merge deep elements in wide selection without fuse', () => {
    const selection = rangeSelection(
      ['para1', 'span12', 'span122'],
      2,
      ['para2', 'span22'],
      3
    )
    expectOps(deleteSelectionOps(composition, selection)).toEqual([
      '[para1.span13] => ø',
      '[para1.span14] => ø',
      '[para1.span15] => ø',
      '[para2] => ø',
      "[para1.span12.span122] => 'li'",
      "[para1.span22] => 'sage'",
      "[para1.span23] => '. Hello blah bomgolo frabilou elma tec.'",
      '[para1.span12.span122:2]',
    ])
  })

  it('should merge elements in wide selection with fuse', () => {
    const selection = rangeSelection(['para1', 'span13'], 8, ['para3'], 8)
    expectOps(deleteSelectionOps(composition, selection)).toEqual([
      '[para1.span14] => ø',
      '[para1.span15] => ø',
      '[para3] => ø',
      '[para2] => ø',
      "[para1.span13] => 'to view the third paragraph. My tailor types fast.'",
      '[para1.span13:8]',
    ])
  })

  it('should merge elements in local selection accross markup with fuse', () => {
    const selection = rangeSelection(
      ['para2', 'span21'],
      12,
      ['para2', 'span23'],
      13
    )
    expectOps(deleteSelectionOps(composition, selection)).toEqual([
      "[para2] => 'This is the bomgolo frabilou elma tec.'",
      '[para2:12]',
    ])
  })

  it('should delete wide selection two levels deep without fuse', () => {
    const selection = rangeSelection(['para2', 'span22'], 3, ['para3'], 32)

    expectOps(deleteSelectionOps(composition, selection)).toEqual([
      '[para2.span23] => ø',
      '[para3] => ø',
      "[para2.span22] => 'mes'",
      "[para2.para3] => 'tailor types fast.'",
      '[para2.span22:3]',
    ])
  })

  it('shoud delete wide selection three levels deep without fuse', () => {
    const selection = rangeSelection(
      ['para1', 'span12', 'span122'],
      2,
      ['para2', 'span23'],
      35
    )
    expectOps(deleteSelectionOps(composition, selection)).toEqual([
      '[para1.span13] => ø',
      '[para1.span14] => ø',
      '[para1.span15] => ø',
      '[para2] => ø',
      "[para1.span12.span122] => 'li'",
      "[para1.span23] => 'tec.'",
      '[para1.span12.span122:2]',
    ])
  })
})

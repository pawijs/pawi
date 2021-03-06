import { describe, expectOps, it } from 'test'
import { doEnter } from './doEnter'
import { caretSelection } from './utils/caretSelection'
import { mockComposition, mockRef } from './utils/testUtils'

const composition = mockComposition()

describe('doEnter', () => {
  it('should split to make new paragraph', () => {
    mockRef()
    const selection = caretSelection(['para1', 'span12', 'span122'], 2)
    expectOps(doEnter(composition, selection)).toEqual([
      "[para1.span12.span122] => 'li'",
      '[para1.span13] => ø',
      '[para1.span14] => ø',
      '[para1.span15] => ø',
      "[refe1] => [refe2: 'nk ', span13: 'to view the next ', span14: 'page', span15: '.']",
      '[refe1.refe2:0]',
    ])
  })

  it('should create new paragraph when selection at end', () => {
    mockRef()
    const selection = caretSelection(['para2', 'span23'], 39)
    expectOps(doEnter(composition, selection)).toEqual([
      "[refe1] => ''",
      '[refe1:0]',
    ])
  })

  it('should move all to new paragraph', () => {
    mockRef()
    const selection = caretSelection(['para1', 'span11'], 0)
    expectOps(doEnter(composition, selection)).toEqual([
      "[para1.span11] => ''",
      // TODO: This should probably be this instead (but it will
      // need fixing.) '[para1.span12] => ø',
      '[para1.span12.span121] => ø',
      '[para1.span12.span122] => ø',
      '[para1.span13] => ø',
      '[para1.span14] => ø',
      '[para1.span15] => ø',
      "[refe1] => [refe2: 'You can click ', span121: 'this ', span122: 'link ', span13: 'to view the next ', span14: 'page', span15: '.']",
      '[refe1.refe2:0]',
    ])
  })

  it('should split flat paragraph', () => {
    mockRef()
    const selection = caretSelection(['para3'], 11)
    expectOps(doEnter(composition, selection)).toEqual([
      "[para3] => 'This is the'",
      "[refe1] => 'third paragraph. My tailor types fast.'",
      '[refe1:0]',
    ])
  })
})

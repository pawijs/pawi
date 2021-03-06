import { describe, expect, it } from 'test'
import { doOperation, makeOps } from './doOperation'
import { caretSelection } from './utils/caretSelection'
import { mockComposition, opResults, mockRef } from './utils/testUtils'
import { CompositionType, EditorProvider, SelectionType } from './utils/types'

const composition = mockComposition()

const opts: Partial<EditorProvider> = {
  getMarkup() {
    return undefined
  },
}

function doTest(comp: CompositionType, selection: SelectionType) {
  return opResults(
    makeOps(
      opts as EditorProvider,
      doOperation(opts as EditorProvider, comp, selection, 'Delete'),
      selection
    )
  )
}
describe('doDelete', () => {
  it('should delete a custom paragraph', () => {
    mockRef()
    const composition = mockComposition(true)
    const selection = caretSelection(['para2'], 0)
    expect(doTest(composition, selection)).toEqual([
      `[delete] para2`,
      `[select] para3:0`,
    ])
  })

  it('should remove next character', () => {
    const selection = caretSelection(['para2', 'span22'], 2)
    expect(doTest(composition, selection)).toEqual([
      "[update] para2.span22 [B:1] 'mesage'",
      '[select] para2.span22:2',
    ])
  })

  it('should merge with next paragraph if at end', () => {
    const selection = caretSelection(['para1', 'span15'], 1)
    expect(doTest(composition, selection)).toEqual([
      '[delete] para2',
      "[update] para1.span15 [T:4] '.This is the first '",
      "[update] para1.span22 [B:6] 'message'",
      "[update] para1.span23 [T:7] '. Hello blah bomgolo frabilou elma tec.'",
      '[select] para1.span15:1',
    ])
  })

  it('should merge and fuse with next complex paragraph at start of line', () => {
    const selection = caretSelection(['para2', 'span23'], 39)
    expect(doTest(composition, selection)).toEqual([
      '[delete] para3',
      "[update] para2.span23 [T:2] '. Hello blah bomgolo frabilou elma tec.This is the third paragraph. My tailor types fast.'",
      '[select] para2.span23:39',
    ])
  })

  it('should merge with next complex paragraph at start of line', () => {
    const selection = caretSelection(['para2', 'span23'], 39)
    const composition = mockComposition()
    const comp = composition as any
    comp.g['para2'].g['span23'].t = 'B+I'
    expect(doTest(composition, selection)).toEqual([
      '[delete] para3',
      "[update] para2.para3 [T:3] 'This is the third paragraph. My tailor types fast.'",
      '[select] para2.span23:39',
    ])
  })

  it('should remove last character', () => {
    const selection = caretSelection(['para2', 'span23'], 0)
    const composition = mockComposition()
    const comp = composition as any
    comp.g['para2'].g['span23'].i = '.'
    expect(doTest(composition, selection)).toEqual([
      '[delete] para2.span23',
      '[select] para2.span22:7',
    ])
  })
})

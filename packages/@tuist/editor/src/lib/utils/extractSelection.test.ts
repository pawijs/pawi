import { describe, expect, it } from 'test'

import { extractSelection } from './extractSelection'
import { rangeSelection } from './rangeSelection'
import { changesResults, mockComposition, mockRef } from './testUtils'
import { caretSelection } from './caretSelection'

const composition = mockComposition()

describe('extractSelection', () => {
  it('should extract simple selection in plain paragraph', () => {
    mockRef()
    const selection = rangeSelection(['para3'], 12, ['para3'], 17)
    expect(changesResults(extractSelection(composition, selection))).toEqual({
      selected: ['para3.refe2-T'],
      updated: [
        'para3-P [2]',
        'para3.refe1-T [0]',
        'para3.refe2-T [1]',
        'para3.refe3-T [2]',
      ],
      deleted: [],
      start: "para3.refe1 [T:0] 'This is the '",
      end: "para3.refe3 [T:2] ' paragraph. My tailor types fast.'",
      selection: '',
    })
  })

  it('should extract simple selection in plain paragraph', () => {
    mockRef()
    const selection = rangeSelection(
      ['para2', 'span22'],
      1,
      ['para2', 'span22'],
      4
    )
    expect(changesResults(extractSelection(composition, selection))).toEqual({
      selected: ['para2.refe1-B'],
      updated: [
        'para2.span22-B [1]',
        'para2.refe1-B [1.5]',
        'para2.refe2-B [1.75]',
      ],
      deleted: [],
      start: "para2.span22 [B:1] 'm'",
      end: "para2.refe2 [B:1.75] 'age'",
      selection: '',
    })
  })

  it('should extract selection accross markup', () => {
    mockRef()
    const selection = rangeSelection(
      ['para2', 'span21'],
      5,
      ['para2', 'span23'],
      7
    )
    expect(changesResults(extractSelection(composition, selection))).toEqual({
      selected: ['para2.refe1-T', 'para2.span22-B', 'para2.refe2-T'],
      updated: [
        'para2.span21-T [0]',
        'para2.refe1-T [0.5]',
        'para2.refe2-T [2]',
        'para2.span23-T [3]',
      ],
      deleted: [],
      start: "para2.span21 [T:0] 'This '",
      end: "para2.span23 [T:3] ' blah bomgolo frabilou elma tec.'",
      selection: '',
    })
  })

  it('should extract single element fully selected', () => {
    mockRef()
    const selection = rangeSelection(
      ['para2', 'span22'],
      0,
      ['para2', 'span22'],
      7
    )
    expect(changesResults(extractSelection(composition, selection))).toEqual({
      selected: ['para2.span22-B'],
      updated: [],
      deleted: [],
      start: "para2.span22 [B:1] 'message'",
      end: "para2.span22 [B:1] 'message'",
      selection: '',
    })
  })

  it('should extract accross paragraphs', () => {
    mockRef()
    const selection = rangeSelection(['para2', 'span21'], 8, ['para3'], 7)
    expect(changesResults(extractSelection(composition, selection))).toEqual({
      selected: [
        'para2.refe1-T',
        'para2.span22-B',
        'para2.span23-T',
        'para3.refe2-T',
      ],
      updated: [
        'para2.span21-T [0]',
        'para2.refe1-T [0.5]',
        'para3-P [2]',
        'para3.refe2-T [0]',
        'para3.refe3-T [1]',
      ],
      deleted: [],
      start: "para2.span21 [T:0] 'This is '",
      end: "para3.refe3 [T:1] ' the third paragraph. My tailor types fast.'",
      selection: '',
    })
  })

  it('should extract caret selection', () => {
    mockRef()
    const selection = caretSelection(['para3'], 4)
    expect(changesResults(extractSelection(composition, selection))).toEqual({
      selected: [],
      updated: [],
      deleted: [],
      start: "para3 [P:2] 'This is the third paragraph. My tailor types fast.'",
      end: "para3 [P:2] 'This is the third paragraph. My tailor types fast.'",
      selection: 'para3:4',
    })
  })

  it('should extract with empty end element at 0', () => {
    mockRef()
    const composition = mockComposition(true)
    composition.g['para3'].i = ''
    const selection = rangeSelection(['para1', 'span15'], 0, ['para3'], 0)
    expect(changesResults(extractSelection(composition, selection))).toEqual({
      selected: ['para1.span15-T', 'para2-P', 'para3-P'],
      updated: [],
      deleted: [],
      start: "para1.span15 [T:4] '.'",
      end: "para3 [P:2] ''",
      selection: '',
    })
  })

  it('should extract with custom element as end', () => {
    mockRef()
    const composition = mockComposition(true)
    const selection = rangeSelection(['para1', 'span15'], 0, ['para2'], 0)
    expect(changesResults(extractSelection(composition, selection))).toEqual({
      selected: ['para1.span15-T', 'para2-P'],
      updated: [],
      deleted: [],
      start: "para1.span15 [T:4] '.'",
      end: 'para2 [P:1:X]',
      selection: 'para1.span15:0 -> para2:0',
    })
  })

  it('should extract with custom element as start', () => {
    mockRef()
    const composition = mockComposition(true)
    const selection = rangeSelection(['para2'], 0, ['para3'], 4)
    expect(changesResults(extractSelection(composition, selection))).toEqual({
      selected: ['para2-P', 'para3.refe1-T'],
      updated: ['para3-P [2]', 'para3.refe1-T [0]', 'para3.refe2-T [1]'],
      deleted: [],
      start: 'para2 [P:1:X]',
      end: "para3.refe2 [T:1] ' is the third paragraph. My tailor types fast.'",
      selection: 'para2:0 -> para3:4',
    })
  })
})

import { describe, expect, it } from 'test'
import { doOperation, makeOps, OperationsKey } from './doOperation'
import { caretSelection } from './utils/caretSelection'
import { rangeSelection } from './utils/rangeSelection'
import {
  makeComposition,
  mockComposition,
  mockRef,
  opResults,
} from './utils/testUtils'
import {
  CompositionType,
  EditorProvider,
  ParagraphPayload,
  SelectionType,
} from './utils/types'

const composition = mockComposition()

const mockProvider: Partial<EditorProvider> = {
  getMarkup() {
    return undefined
  },
}

function doTest(
  composition: CompositionType,
  selection: SelectionType,
  op: OperationsKey,
  opts: ParagraphPayload
) {
  const changes = doOperation(
    mockProvider as EditorProvider,
    composition,
    selection,
    op,
    opts
  )
  return opResults(makeOps(mockProvider as EditorProvider, changes, selection))
}

describe('doOperation.B', () => {
  it('should render bold selection', () => {
    mockRef()
    const selection = rangeSelection(['para3'], 12, ['para3'], 17)
    expect(doTest(composition, selection, 'B', {})).toEqual([
      "[update] para3 [P:2] 'undefined'",
      "[update] para3.refe1 [T:0] 'This is the '",
      "[update] para3.refe2 [B:1] 'third'",
      "[update] para3.refe3 [T:2] ' paragraph. My tailor types fast.'",
      '[select] para3.refe2:0 -> para3.refe2:5',
    ])
  })

  it('should remove bold selection', () => {
    mockRef()
    const selection = rangeSelection(
      ['para2', 'span22'],
      0,
      ['para2', 'span22'],
      7
    )
    expect(doTest(composition, selection, 'B', {})).toEqual([
      `[update] para2 [P:1] 'This is the first message. Hello blah bomgolo frabilou elma tec.'`,
      `[select] para2:18 -> para2:25`,
    ])
  })

  it('should render larger bold selection', () => {
    mockRef()
    const selection = rangeSelection(
      ['para2', 'span21'],
      5,
      ['para2', 'span23'],
      7
    )

    expect(doTest(composition, selection, 'B', {})).toEqual([
      '[delete] para2.span22',
      `[update] para2.refe1 [B:0.5] 'is the first message. Hello'`,
      `[update] para2.span21 [T:0] 'This '`,
      `[update] para2.span23 [T:3] ' blah bomgolo frabilou elma tec.'`,
      `[select] para2.refe1:0 -> para2.refe1:27`,
    ])
  })

  it('should render bold selection after other markup', () => {
    mockRef()
    const selection = rangeSelection(
      ['para2', 'span23'],
      13,
      ['para2', 'span23'],
      20
    )

    expect(doTest(composition, selection, 'B', {})).toEqual([
      `[update] para2.refe1 [B:3] 'bomgolo'`,
      `[update] para2.refe2 [T:4] ' frabilou elma tec.'`,
      `[update] para2.span23 [T:2] '. Hello blah '`,
      `[select] para2.refe1:0 -> para2.refe1:7`,
    ])
  })

  it('should render bold entire paragraph', () => {
    mockRef()
    const selection = rangeSelection(
      ['para2', 'span23'],
      13,
      ['para3'],
      (composition.g['para3'] as any).i.length
    )

    expect(doTest(composition, selection, 'B', {})).toEqual([
      `[update] para2.refe1 [B:3] 'bomgolo frabilou elma tec.'`,
      `[update] para2.span23 [T:2] '. Hello blah '`,
      `[update] para3 [P:2] 'undefined'`,
      `[update] para3.refe2 [B:0] 'This is the third paragraph. My tailor types fast.'`,
      `[select] para2.refe1:0 -> para3.refe2:50`,
    ])
  })

  it('should remove bold on entire paragraph', () => {
    mockRef()
    const composition = mockComposition()
    composition.g['para3'] = {
      p: 2,
      t: 'P',
      g: {
        span31: {
          t: 'B',
          p: 0,
          i: 'Hello',
        },
      },
    }
    const comp = composition as any
    delete comp.g['para2'].g['span23']
    // Selects all bold
    const selection = rangeSelection(['para2', 'span22'], 0, ['para3'], 5)

    expect(doTest(composition, selection, 'B', {})).toEqual([
      `[update] para2 [P:1] 'This is the first message'`,
      `[update] para3 [P:2] 'Hello'`,
      `[select] para2:18 -> para3:5`,
    ])
  })
})

describe('doOperation.P', () => {
  it('should create a custom paragraph', () => {
    mockRef()
    const selection = caretSelection(['para6'], 0)
    const opts = { c: 'Foo', data: { this: 'that' } }
    expect(doTest(composition, selection, 'P', opts)).toEqual([
      `[update] para6 [P:5:Foo]`,
      `[resized]`,
      // Ensure last paragraph is a text one.
      `[update] refe1 [P:6] ''`,
      `[select] para6:0`,
      `[toolbox]`,
      `[data] para6`,
    ])
  })
})

describe('doOperation - delete', () => {
  it('should remove selection and merge', () => {
    mockRef()
    const selection = rangeSelection(
      ['para2', 'span22'],
      0,
      ['para2', 'span22'],
      7
    )
    expect(doTest(composition, selection, 'Backspace', {})).toEqual([
      `[update] para2 [P:1] 'This is the first . Hello blah bomgolo frabilou elma tec.'`,
      `[select] para2:18`,
    ])
  })

  it('should remove selection and merge accross paragraphs', () => {
    mockRef()
    const selection = rangeSelection(['para2', 'span23'], 8, ['para3'], 8)
    expect(doTest(composition, selection, 'Backspace', {})).toEqual([
      '[delete] para3',
      "[update] para2.span23 [T:2] '. Hello the third paragraph. My tailor types fast.'",
      '[select] para2.span23:8',
    ])
  })

  it('should remove including custom para', () => {
    mockRef()
    const composition = makeComposition({ title: 'Hello Editor', id: 'one' })
      .addParagraph('two', {
        p: 1,
        t: 'P',
        g: {
          one: { p: 0, t: 'T', i: 'One ' },
          two: { p: 1, t: 'B', i: 'more' },
          three: { p: 2, t: 'T', i: ' time.' },
        },
      })
      .addParagraph('three', { p: 2, t: 'P', c: 'X' })
      .setData('three', { value: 0.5 })
      .addParagraph('four', { p: 3, t: 'P', i: '' })
      .done()
    const selection = rangeSelection(['one'], 0, ['four'], 0)
    expect(doTest(composition, selection, 'Backspace', {})).toEqual([
      `[delete] four`,
      `[delete] one`,
      `[delete] three`,
      `[delete] two`,
      `[update] refe1 [P:0:TITLE] ''`,
      `[select] refe1:0`,
    ])
  })
})

describe('doOperation.Input', () => {
  it('should change text', () => {
    mockRef()
    const selection = caretSelection(['para3'], 7)
    const opts = { i: 'This was the third paragraph.' }
    expect(doTest(composition, selection, 'Input', opts)).toEqual([
      "[update] para3 [P:2] 'This was the third paragraph.'",
      '[select] para3:7',
    ])
  })

  it('should remove range selection before text update', () => {
    mockRef()
    const selection = rangeSelection(['para2', 'span21'], 0, ['para3'], 7)
    expect(
      doTest(composition, selection, 'Input', {
        i: 'This was',
      })
    ).toEqual([
      '[delete] para3',
      "[update] para2 [P:1] 'This was the third paragraph. My tailor types fast.'",
      '[select] para2:8',
    ])
  })
})

import { describe, expect, it } from 'test'

import { stripZeroWidthChar } from './stripZeroWidthChar'
import { SelectionType } from './utils/types'

describe('stripZeroWidthChar', () => {
  it('does not alter text without zero width char', () => {
    expect(stripZeroWidthChar('some text', {} as SelectionType)).toEqual({
      value: 'some text',
    })
  })

  it('remove zero width char and update selection', () => {
    const selection = { anchorOffset: 3 } as SelectionType
    expect(stripZeroWidthChar('\u200Bfoobar', selection)).toEqual({
      value: 'foobar',
      selection: { anchorOffset: 2, focusOffset: 2 },
    })
  })

  it('remove zero width char and does not update selection', () => {
    const selection = { anchorOffset: 3 } as SelectionType
    expect(stripZeroWidthChar('hello \u200Bfoobar', selection)).toEqual({
      value: 'hello foobar',
      selection,
    })
  })
})

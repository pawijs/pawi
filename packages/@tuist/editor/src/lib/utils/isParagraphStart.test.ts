import { describe, expect, it } from 'test'

import { isParagraphStart } from './isParagraphStart'
import { mockComposition } from './testUtils'

const composition = mockComposition()

describe('isParagraphStart', () => {
  it('returns true for simple para start', () => {
    expect(isParagraphStart(composition, ['para3'], 0)).toBe(true)
  })

  it('returns true for complex para start', () => {
    expect(isParagraphStart(composition, ['para1', 'span11'], 0)).toBe(true)
  })

  it('returns false for offset greater then zero', () => {
    expect(isParagraphStart(composition, [], 1)).toBe(false)
  })

  it('returns false for complex para start', () => {
    expect(
      isParagraphStart(composition, ['para1', 'span12', 'span121'], 0)
    ).toBe(false)
  })
})

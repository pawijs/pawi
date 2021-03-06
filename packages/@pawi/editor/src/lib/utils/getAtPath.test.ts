import { describe, expect, it } from 'test'

import { getAtPath } from './getAtPath'
import { mockComposition } from './testUtils'

const composition = mockComposition()

describe('getAtPath', () => {
  it('gets element in root', () => {
    expect(getAtPath(composition, ['para3'])).toBe(composition.g['para3'])
  })

  it('gets element in root', () => {
    expect(getAtPath(composition, ['para1', 'span12', 'span121'])).toBe(
      (composition as any).g['para1'].g['span12'].g['span121']
    )
  })

  it('gets root element', () => {
    expect(getAtPath(composition, [])).toBe(composition)
  })
})

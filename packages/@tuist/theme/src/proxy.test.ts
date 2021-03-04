import { describe, expect, it } from 'test'

import { themeProxy } from './'

describe('themeProxy', () => {
  it('should return css vars for values', () => {
    expect(themeProxy({ one: '10px', two: 'bong' })).toEqual({
      one: 'var(--one)',
      two: 'var(--two)',
    })
  })
})

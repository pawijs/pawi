import { describe, expect, it } from 'test'

import { makeRef } from './makeRef'

describe('makeRef', () => {
  it('should create random strings', () => {
    expect(makeRef().length).toEqual(6)
  })
})

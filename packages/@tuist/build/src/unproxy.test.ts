import { describe, expect, it } from 'test'
import { deepCopy, unproxy } from './unproxy'

describe('deepCopy', () => {
  it('should make a deep copy', () => {
    const obj = { a: {}, b: { c: {} } }
    const copy = deepCopy(obj)
    expect(copy.a).not.toBe(obj.a)
    expect(copy.b.c).not.toBe(obj.b.c)
  })
})

describe('unproxy', () => {
  it('should be an alias for deepCopy', () => {
    expect(unproxy).toBe(deepCopy)
  })
})

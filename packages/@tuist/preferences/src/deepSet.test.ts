import { describe, expect, it, restore } from 'test'
import { deepSet } from './helper'
import simple from 'simple-mock'

describe('deepSet', () => {
  afterEach(restore)
  it('should set deep value', () => {
    const base = {}
    deepSet(base, 'foo.bar.baz', 'hello')
    expect(base).toEqual({ foo: { bar: { baz: 'hello' } } })
  })

  it('should break on blank path', () => {
    const errors: string[] = []
    simple.mock(console, 'error').callFn((error: string) => {
      errors.push(error)
    })
    const base = {}
    deepSet(base, '', 'hello')
    expect(errors).toEqual([`Invalid path '' for deepSet.`])
  })

  it('should break on incompatible state', () => {
    const errors: string[] = []
    simple.mock(console, 'error').callFn((error: string) => {
      errors.push(error)
    })
    const base = { foo: 'hello' }
    deepSet(base, 'foo.bar', 'wrong')
    expect(errors).toEqual([
      `Cannot deepSet 'foo.bar' (not compatible with base state).`,
    ])
  })

  it('should delete value on null or undefined', () => {
    const base = { foo: { a: 'a', b: 'b', c: 'c', d: true } }
    deepSet(base, 'foo.a', null)
    deepSet(base, 'foo.b', undefined)
    deepSet(base, 'foo.d', false)
    expect(base).toEqual({ foo: { c: 'c', d: false } })
  })
})

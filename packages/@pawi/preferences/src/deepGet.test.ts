import simple from 'simple-mock'
import { describe, expect, it, restore } from 'test'
import { deepGet } from './helper'

describe('deepGet', () => {
  afterEach(restore)
  it('should get deep value', () => {
    const base = { foo: { bar: { baz: 'hello' } } }
    expect(deepGet(base, 'foo.bar.baz')).toEqual('hello')
  })

  it('should break on blank path', () => {
    const errors: string[] = []
    simple.mock(console, 'error').callFn((error: string) => {
      errors.push(error)
    })
    const base = {}
    deepGet(base, '')
    expect(errors).toEqual([`Invalid path '' for deepGet.`])
  })

  it('should break on incompatible state', () => {
    const errors: string[] = []
    simple.mock(console, 'error').callFn((error: string) => {
      errors.push(error)
    })
    const base = { foo: 'hello' }
    deepGet(base, 'foo.bar')
    expect(errors).toEqual([
      `Cannot deepGet 'foo.bar' (not compatible with base state).`,
    ])
  })
})

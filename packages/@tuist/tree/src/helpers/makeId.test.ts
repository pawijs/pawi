import { afterAll, describe, expect, it, mockRandomValues, restore } from 'test'
import { makeId } from './makeId'

describe('makeId', () => {
  afterAll(restore)
  it('should create a unique id in scope', () => {
    // Just make sure mock id works
    mockRandomValues()
    expect(makeId({})).toBe('id1')
    mockRandomValues()
    expect(makeId({})).toBe('id1')

    mockRandomValues()
    expect(makeId({ id1: '', id2: '' })).toBe('id3')
  })
})

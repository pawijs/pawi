import { mockRef, restore } from 'test'
import { makeRef } from './makeRef'

describe('makeRef', () => {
  it('should create random ids', () => {
    expect(makeRef({} as any)).not.toBe(makeRef({} as any))
  })

  it('should have length 6', () => {
    const id = makeRef({} as any)
    expect(id.length).toBe(6)
  })
})

describe('makeRef.mockId', () => {
  beforeEach(mockRef)
  afterEach(restore)
  it('should create mock id', () => {
    expect(makeRef({})).toBe('ref1')
  })

  it('should not clash ids in group', () => {
    expect(makeRef({ ref1: '', ref2: 0 })).toBe('ref3')
  })
})

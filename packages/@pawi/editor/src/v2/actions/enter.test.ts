import { describe, makeTest, mockRef, restore } from 'test'
import { enter } from '.'

describe('enter', () => {
  const it = makeTest(m => enter(m, {}))
  beforeEach(mockRef)
  afterEach(restore)

  it('should create new paragraph', {
    i: 'a|',
    o: 'a/|',
  })

  it('should split paragraph', {
    i: 'a/b=B:bb|bb.bbcc/c',
    o: 'a/b=B:bb/ref1=B:|bb.bbcc/c',
  })
})

describe('enter.shift', () => {
  const it = makeTest(m => enter(m, { shiftKey: true }))

  it('force line break', {
    i: 'a|',
    o: 'a=a.E:|',
  })

  it('force with split line break', {
    i: 'a/b=B:bb|bb.B:bbcc/c',
    o: 'a/b=B:bb.E:|.bb.B:bbcc/c',
  })
})

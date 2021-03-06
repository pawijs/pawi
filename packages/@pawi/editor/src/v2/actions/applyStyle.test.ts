import { describe, makeTest, mockRef, restore } from 'test'
import { applyStyle } from '.'
import { TypeName } from '../types'

describe('applyStyle.B', () => {
  beforeEach(mockRef)
  afterEach(restore)
  const it = makeTest<{ t: TypeName }>((m, { t }) => applyStyle(m, t))

  it('should change style on whole sub-para', {
    t: 'B',
    i: 'a/[b]/c',
    o: 'a/b=B:[b]/c',
  })

  it('should insert caret with new empty sub-para', {
    t: 'B',
    i: 'a/bo|b/c',
    o: 'a/bob=bo.B:|.b/c',
  })

  it('should change style on part of sub-para', {
    t: 'B',
    i: 'a/b[o]b/c',
    o: 'a/bob=b.B:[o].b/c',
  })

  it('should remove style on part of sub-para', {
    t: 'B',
    i: 'a/bob=b.B:[o].b/c',
    o: 'a/b[o]b/c',
  })

  it('should simplify accross para', {
    t: 'B',
    i: 'a/x=b.B:[ob/y=B:la]',
    o: 'a/b[ob/la]',
  })

  it('should apply on whole para with sub-para', {
    t: 'B',
    i: 'a[a/x=b.B:ob/y=B:la]',
    o: 'aa=a.B:[a/x=B:bob/y=B:la]',
  })

  it('should revert on whole para with sub-para', {
    t: 'B',
    i: 'aa=a.B:[a/x=B:bob/y=B:la]',
    o: 'a[a/bob/la]',
  })

  it('should ignore custom para', {
    t: 'B',
    i: 'a[a/b{"c":"X"}/c]c',
    o: 'aa=a.B:[a/b{"c":"X"}/cc=B:c].c',
  })
})

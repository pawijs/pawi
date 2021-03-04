import { describe, makeTest } from 'test'
import { backspace } from '.'

const it = makeTest(m => backspace(m))

describe('backspace.caret', () => {
  it('should collapse to sibling', {
    i: 'a/|b/c',
    o: 'a|b/c',
  })

  it('should collapse to cousin', {
    i: 'a=B:a1.a2/|b/c',
    o: 'a=B:a1.a2|b/c',
  })

  it('should remove normal text', {
    i: 'ox|',
    o: 'o|',
  })

  it('should remove emoji', {
    i: 'o😊|',
    o: 'o|',
  })

  it('should remove normal accents', {
    i: 'oñ|',
    o: 'o|',
  })

  it('should make empty paragraph', {
    i: 'a/b|/c',
    o: 'a/|/c',
  })

  it('should remove empty paragraph', {
    i: 'a/|/c',
    o: 'a|/c',
  })

  it('should simplify result', {
    i: 'a/b=b1.x|/c',
    o: 'a/b1|/c',
  })

  it('should select in neighbour', {
    // rule (1): move selection to type in left element
    i: 'a/b=b1.b|2/c',
    o: 'a/b=b1|.2/c',
  })
})

describe('backspace.range', () => {
  it('should remove and fuse', {
    i: 'a[/b=b1.b2/c=c1.coo]l',
    o: 'a|l',
  })

  it('should remove and fuse in start', {
    i: 'a/b=B:b[1.b2/c=c1.coo]l',
    o: 'a/b=B:b|.l',
  })

  it('should fuse paragraph', {
    i: 'a[/]b/c',
    o: 'a|b/c',
  })

  it('should remove empty end', {
    i: 'a[/b/c]',
    o: 'a|',
  })

  it('should fuse in sub-paragraph', {
    i: 'a/b=b1.B:b[2.b]3/c',
    o: 'a/b=b1.B:b|.3/c',
  })
})

describe('backspace.columns', () => {
  it('should clear columns if last right', {
    i: 'a/l:b/l:c/r:|',
    o: 'a/b/c|',
  })

  it('should not clear columns if not last right', {
    i: 'a/l:b/l:c/r:|/r:xx',
    o: 'a/l:b/l:c|/r:xx',
  })
})

describe('backspace.removeData', () => {
  it('should remove data', {
    i: 'a[/b{"c":"X"}/c]_{"b":"foo"}',
    o: 'a|_{}',
  })
})

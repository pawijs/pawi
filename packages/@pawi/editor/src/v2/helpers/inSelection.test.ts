import { describe, expect, it, mut } from 'test'
import { inSelection } from '.'
import { rangeSelection } from './selection'

function test(s: string, l: string[][]) {
  return expect(inSelection(mut(s)).map(r => r.path)).toEqual(l)
}

describe('inSelection', () => {
  it('should find in same paragraph', () => {
    expect(inSelection(mut('foo/b[ar]/baz'))).toEqual([
      {
        anchor: true,
        focus: true,
        path: ['bar'],
        elem: {
          t: 'P',
          p: 1,
          i: 'bar',
          s: rangeSelection(['bar'], 1, ['bar'], 3),
        },
      },
    ])
  })

  it('should find in two root paragraphs', () => {
    test('foo/b[ar/baz=bz1.bz2/big/bo]g', [['bar'], ['baz'], ['big'], ['bog']])
  })

  it('should find in two sub-paragraphs', () => {
    test('a/b=b1.b[2.b3/co]ol', [['b', 'b2'], ['b', 'b3'], ['cool']])
  })

  it('should find in two children from same root', () => {
    test('/foo/bar=b[1.b2.b]3/baz', [
      ['bar', 'b1'],
      ['bar', 'b2'],
      ['bar', 'b3'],
    ])
  })

  it('should find in children from diff roots', () => {
    test('bar=ba[r1.bar2/bog=bog1.bog2/pok=pok1.pok2.pok]3', [
      ['bar', 'bar1'],
      ['bar', 'bar2'],
      ['bog'],
      ['pok', 'pok1'],
      ['pok', 'pok2'],
      ['pok', 'pok3'],
    ])
  })
})

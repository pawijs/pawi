import { describe, expect, it, mut, parseKey } from 'test'
// import { rangeSelection } from './helpers'
import { caretSelection, getSelection, rangeSelection } from './helpers'

describe('parseKey', () => {
  it('should parse simple key', () => {
    expect(parseKey([], [], 'hello')).toEqual({
      id: 'hello',
      i: 'hello',
    })
  })

  it('should not clash id', () => {
    expect(parseKey(['hello'], [], 'hello')).toEqual({
      id: 'hello1',
      i: 'hello',
    })
  })

  it('should parse type in key', () => {
    expect(parseKey([], [], 'B:hello')).toEqual({
      id: 'hello',
      i: 'hello',
      type: 'B',
    })
  })

  it('should parse type in empty para', () => {
    expect(parseKey([], [], 'B:')).toEqual({
      id: '',
      i: '',
      type: 'B',
    })
  })

  it('should parse json in key', () => {
    expect(parseKey([], [], 'hello{"foo":"bar","baz":"bong"}')).toEqual({
      id: 'hello',
      i: 'hello',
      json: { foo: 'bar', baz: 'bong' },
    })
  })

  it('should parse caret selection', () => {
    expect(parseKey([], [], 'hell|o')).toEqual({
      id: 'hello',
      i: 'hello',
      s: caretSelection(['hello'], 4),
    })
  })

  it('should parse starting range selection', () => {
    expect(parseKey([], [], 'hell[o')).toEqual({
      id: 'hello',
      i: 'hello',
      s: rangeSelection(['hello'], 4, ['unknown'], 0),
      // unfinished selection
      us: rangeSelection(['hello'], 4, ['unknown'], 0),
    })
  })

  it('should parse starting and ending range selection', () => {
    expect(parseKey([], [], 'hell[o]')).toEqual({
      id: 'hello',
      i: 'hello',
      s: rangeSelection(['hello'], 4, ['hello'], 5),
    })
  })

  it('should parse starting and ending range selection with after', () => {
    expect(parseKey([], [], 'hell[o]')).toEqual({
      id: 'hello',
      i: 'hello',
      s: rangeSelection(['hello'], 4, ['hello'], 5),
    })
  })
})

describe('tum', () => {
  it('should parse clashing ids in sub-para', () => {
    expect(mut('a/bob=b.B:[o].b/c').comp.g).toEqual({
      a: {
        i: 'a',
        p: 0,
        t: 'P',
      },
      bob: {
        g: {
          b: {
            i: 'b',
            p: 0,
            t: 'T',
          },
          o: {
            i: 'o',
            p: 1,
            s: {
              anchorOffset: 0,
              anchorPath: ['bob', 'o'],
              focusOffset: 1,
              focusPath: ['bob', 'o'],
              position: {
                left: 0,
                top: 0,
              },
              type: 'Range',
            },
            t: 'B',
          },
          b1: {
            i: 'b',
            p: 2,
            t: 'T',
          },
        },
        p: 1,
        t: 'P',
      },
      c: {
        i: 'c',
        p: 2,
        t: 'P',
      },
    })
  })

  it('should parse complex selection across para', () => {
    expect(getSelection(mut('aa=a.B:[a/x=B:bob/y=B:la]'))).toEqual(
      rangeSelection(['aa', 'a1'], 0, ['y', 'la'], 2)
    )
  })
})

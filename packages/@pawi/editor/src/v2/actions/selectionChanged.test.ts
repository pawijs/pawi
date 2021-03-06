import { describe, makeTest } from 'test'
import { caretSelection } from '../helpers'
import { Selection } from '../types'
import { selectionChanged } from '.'

const it = makeTest<{ s: Selection }>((m, { s }) => selectionChanged(m, s))

describe('selectionChanged', () => {
  it('should select', {
    i: 'a/boom/c',
    s: caretSelection(['boom'], 2),
    o: 'a/bo|om/c',
  })

  it('should remove previous selection', {
    i: 'a/bo|om/c',
    s: caretSelection(['c'], 1),
    o: 'a/boom/c|',
  })
})

describe('selectionChanged.closeOptions', () => {
  it('should close options', {
    i: 'a/bo|om{"o": {"open": true}}/c',
    s: caretSelection(['c'], 1),
    o: 'a/boom/c|',
  })
})

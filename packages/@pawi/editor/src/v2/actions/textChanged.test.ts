import { describe, makeTest } from 'test'

import { Selection } from '../types'
import { caretSelection } from '../../lib'
import { textChanged } from '.'

const it = makeTest<{ txt: string; s: Selection }>((m, { txt, s }) =>
  textChanged(m, { i: txt, s })
)

describe('textInput.caret', () => {
  it('should type new text', {
    txt: 'ahb',
    s: caretSelection(['ab'], 2),
    i: 'a|b',
    o: 'ah|b',
  })
})

describe('textInput.range', () => {
  it('should remove before typing', {
    txt: 'ax',
    s: caretSelection(['a'], 2),
    i: 'a[/b/c]',
    o: 'ax|',
  })
})

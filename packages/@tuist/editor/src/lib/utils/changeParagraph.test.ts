import { describe, expect, it } from 'test'

import { caretSelection } from './caretSelection'
import { changeParagraph } from './changeParagraph'
import { mockComposition } from './testUtils'

const position = { top: 0, left: 0 }

describe('changeParagraph', () => {
  it('creates heading with proper level', () => {
    const composition = mockComposition()
    const selection = caretSelection(['para3'], 0, position)
    expect(
      Object.keys(
        changeParagraph(composition, selection, { o: { h: 3 } }).elements[
          'para3'
        ].elem
      )
    ).toEqual(['p', 't', 'i', 'o'])
  })

  it('resets to simple paragraph', () => {
    const composition = mockComposition()
    composition.g['para3'].o = { h: 3 }
    const selection = caretSelection(['para3'], 0, position)
    expect(
      Object.keys(
        changeParagraph(composition, selection, {}).elements['para3'].elem
      )
    ).toEqual(['p', 't', 'i' /* no option o */])
  })

  it('creates heading with complex paragraph', () => {
    const composition = mockComposition()
    const para2 = composition.g['para2']
    const selection = caretSelection(['para2', 'span21'], 0, position)
    expect(
      changeParagraph(composition, selection, { o: { h: 3 } }).elements['para2']
        .elem
    ).toEqual(Object.assign({}, para2, { o: { h: 3 } }))
  })
})

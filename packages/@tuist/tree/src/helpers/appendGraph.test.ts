import { describe, expect, it } from 'test'
import { TreeType } from 'tuist'
import { appendGraph } from './appendGraph'

type MockBlock = [string, string[]]

function mockGraph(def: MockBlock[], id: string = 'base'): TreeType {
  return {
    id,
    type: 'test',
    version: 'v1',
    entry: def[0][0],
    blocks: Object.assign(
      {},
      ...def.map(m => ({
        [m[0]]: { id: m[0], name: m[0], children: m[1], content: {}, meta: {} },
      }))
    ),
  }
}

describe('appendGraph', () => {
  it('should remap ids', () => {
    const graph = mockGraph([
      ['foo', ['bar', 'baz']],
      ['bar', ['bing']],
      ['baz', []],
      ['bing', []],
    ])
    const branch = mockGraph([
      ['yo', ['bar']],
      ['bar', ['bing']],
      ['bing', []],
    ])
    appendGraph(graph, 'baz', 1, branch)
    const children = graph.blocks['baz'].children
    expect(children).toEqual([null, 'yo'])
    const yo = graph.blocks['yo']
    const newId = yo.children[0]
    expect(typeof newId).toBe('string')
    expect(newId).not.toBe('bar')
    expect(graph.blocks[newId!].name).toBe('bar')
  })

  it('should throw on missing node', () => {
    const graph = mockGraph([
      ['foo', ['bar', 'baz']],
      ['bar', ['bing']],
      ['baz', []],
      ['bing', []],
    ])
    const branch = mockGraph([
      ['yo', ['bar']],
      ['bar', ['bing']],
      ['bing', []],
    ])
    expect(() => appendGraph(graph, 'doom', 1, branch)).toThrow(
      `Cannot append (nodeId 'doom' not in tree).`
    )
  })
})

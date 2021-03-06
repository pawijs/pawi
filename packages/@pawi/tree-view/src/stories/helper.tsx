import { build, settings } from '@pawi/build'
import { Drag } from '@pawi/dragdrop'
import { TStories } from '@pawi/story'
import { tree, TreeSettings, TreeType } from '@pawi/tree'
import { createHook } from 'overmind-react'
import * as React from 'react'
import { treeView } from '..'
import { Comp, styled } from '../app'
import { TreeSVG } from '../components/TreeSVG'
import { uimap } from '../helpers'

export { styled }

const DivWrapper = styled.div`
  background: #444;
`

const MyArea = styled.textarea`
  flex-grow: 1;
  min-height: 30px;
  justify-self: stretch;
  background: #d2cfb1;
`

const contentComponent: Comp<{
  tree: TreeType<{ source: string }>
  nodeId: string
}> = ({ tree, nodeId }) => {
  const ctx = useOvermind()
  const content = tree.blocks[nodeId].content
  return (
    <MyArea
      value={content.source}
      onChange={e => {
        const source = e.target.value
        ctx.actions.tree.setContent({ tree, nodeId, content: { source } })
      }}
    />
  )
}

export const Wrapper: Comp = ({ children }) => {
  return (
    <DivWrapper>
      <Drag />
      {children}
    </DivWrapper>
  )
}

export const svgWrapper: Comp = ({ children }) => {
  return (
    <Wrapper>
      <TreeSVG width={150} height={50}>
        {children}
      </TreeSVG>
    </Wrapper>
  )
}

export const graph: TreeType<{ source: string; lang: string }> = {
  id: 'testgraph',
  version: 'one',
  entry: 'fooId',
  type: 'test',
  blocks: {
    fooId: {
      id: 'fooId',
      name: 'Foo',
      content: { source: `const foo = 'foo source'`, lang: 'ts' },
      children: ['barId', 'bazId'],
    },
    barId: {
      id: 'barId',
      name: 'Bar',
      content: { source: 'bar source', lang: 'ts' },
      childrenCount: 2,
      children: [],
    },
    bazId: {
      id: 'bazId',
      name: 'Baz',
      content: { source: 'baz source', lang: 'ts' },
      children: [],
    },
  },
}

export const graph2: TreeType = {
  id: 'testgraph2',
  version: 'one',
  entry: 'fooId',
  type: 'test',
  blocks: {
    fooId: {
      id: 'fooId',
      name: 'Foo',
      content: {},
      children: [],
    },
  },
}

const uigraph = uimap(graph)

export const config = build({
  name: 'test',
  settings: settings<TreeSettings<{ source: string }>>({
    tree: {
      test: {
        newBlock: () => ({ name: 'new', content: { source: 'empty' } }),
        treeChanged: (ctx, { tree, connecting }) => {
          console.log('tree.changed', tree.id, 'connecting', connecting)
        },
        contentChanged: (ctx, { tree, previousContent }) => {
          console.log(
            'tree.changed',
            tree.id,
            'previousContent',
            previousContent
          )
        },
        contentComponent,
      },
    },
  }),
  state: {
    test: {
      graph,
      graph2,
      uigraph,
    },
  },
})
  .using(treeView)
  .using(tree)
  .config()

export const useOvermind = createHook<typeof config>()
export type Stories<Props = any> = TStories<typeof config, Props>

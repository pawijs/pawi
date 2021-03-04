import * as React from 'react'

import { Comp, styled, useOvermind } from '../app'

import { NodeHeader } from './NodeHeader'
import { Nodes } from './Nodes'
import { TreeDrag } from '../types'
import { TreeType } from '@tuist/tree'

export interface TreeProps<T = any> {
  className?: string
  tree: TreeDrag['tree']
  // Prevent dragged element as behaving like a drop zone.
  noDrop?: boolean
  // Only draw part of the Tree
  nodeId?: string
  extraProps: T
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const Tree: Comp<TreeProps> = ({
  className,
  extraProps,
  tree,
  noDrop,
}) => {
  const ctx = useOvermind()

  if (!tree) {
    return null
  }

  const definition = ctx.state.tree.definitions()[tree.type]
  if (!definition) {
    throw new Error(`Missing definition for tree type '${tree.type}'.`)
  }
  const NodeEdit: Comp<{ tree: TreeType; nodeId: string; extraProps: any }> =
    definition.contentComponent

  const { selected } = tree
  return (
    <Wrapper className={className}>
      <Nodes tree={tree} noDrop={noDrop} />
      {selected ? (
        <React.Fragment>
          <NodeHeader tree={tree} nodeId={selected.id} />
          <NodeEdit tree={tree} nodeId={selected.id} extraProps={extraProps} />
        </React.Fragment>
      ) : null}
    </Wrapper>
  )
}

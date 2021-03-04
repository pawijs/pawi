import * as React from 'react'

import { Comp, styled, useOvermind } from '../app'

import { NodeName } from './NodeName'
import { TreeType } from '@tuist/tree'

export interface NodeHeaderProps {
  className?: string
  tree: TreeType
  nodeId: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  border-radius: 2px;
  background: #ffffff14;
`

export const NodeHeader: Comp<NodeHeaderProps> = ({
  className,
  tree,
  nodeId,
}) => {
  useOvermind()
  return (
    <Wrapper className={className}>
      <NodeName tree={tree} nodeId={nodeId} />
    </Wrapper>
  )
}

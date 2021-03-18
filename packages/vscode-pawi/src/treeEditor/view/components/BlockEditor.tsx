import { TreeType } from '@forten/tree-type'
import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'
import { Icon } from './Icon'

export interface BlockEditorProps {
  className?: string
  tree: TreeType
  blockId: string
  extraProps: any
}

const Wrapper = styled.div`
  padding: 1rem 0;
  display: flex;
  flex-direction: row;
`

const Path = styled.div`
  flex-grow: 1;
  color: #777;
`

export const BlockEditor: Comp<BlockEditorProps> = ({
  className,
  tree,
  blockId,
}) => {
  const ctx = useOvermind()
  function onClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    ctx.actions.treeEditor.makeCopy({ tree, blockId })
  }
  return (
    <Wrapper className={className}>
      <Path>{tree.blocks[blockId].content.file}</Path>
      <Icon icon="copy" onClick={onClick} />
    </Wrapper>
  )
}

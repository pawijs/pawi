import * as React from 'react'
import { TreeType } from 'tuist'
import { Comp, styled, useOvermind } from '../app'

export interface NodeNameProps {
  className?: string
  tree: TreeType
  nodeId: string
}

interface NodeRenameProps {
  className?: string
  tree: TreeType
  nodeId: string
}

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
`

const Name = styled.div`
  padding: 5px;
  flex-grow: 1;
`

const MyInput = styled.input`
  font-family: inherit;
  border: none;
  border-radius: 2px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  font-size: inherit;
  flex-grow: 1;
  padding: 5px;
  margin: 0;
  width: 0;
  background: #ffd58840;
  &:focus {
    outline: none;
  }
`

const NodeRename: Comp<NodeRenameProps> = ({ className, nodeId, tree }) => {
  const ctx = useOvermind()
  const block = tree.blocks[nodeId]
  const [oldValue] = React.useState<string>(block.name)

  function onKeyDown(e: React.KeyboardEvent) {
    const target = e.target as HTMLInputElement
    switch (e.key) {
      case 'Escape':
        ctx.actions.tree.setName({
          tree,
          nodeId,
          name: oldValue,
          done: true,
        })
        break
      case 'Enter':
        ctx.actions.tree.setName({
          tree,
          nodeId,
          name: target.value,
          done: true,
        })
        break
      /*
      case 'Tab':
        ctx.actions.tree.setName({
          tree,
          nodeId,
          name: target.value,
          done: true,
        })
        break
        */
    }
  }

  return (
    <MyInput
      autoFocus
      onFocus={e => e.target.select()}
      onKeyDown={onKeyDown}
      value={block.name}
      onChange={e => {
        const target = e.target as HTMLInputElement
        ctx.actions.tree.setName({
          tree,
          nodeId,
          name: target.value,
        })
      }}
    />
  )
}

export const NodeName: Comp<NodeNameProps> = ({ nodeId, tree }) => {
  const ctx = useOvermind()
  const rename = tree.selected && tree.selected.editName
  const block = tree.blocks[nodeId]
  const onClick = rename
    ? undefined
    : (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        e.preventDefault()
        ctx.actions.tree.selectNode({
          tree,
          id: nodeId,
          editName: true,
        })
      }
  return (
    <Wrapper onClick={onClick}>
      {rename ? (
        <NodeRename tree={tree} nodeId={nodeId} />
      ) : (
        <Name>{block.name}</Name>
      )}
    </Wrapper>
  )
}

import * as React from 'react'
import { Drop, droppable, dropStyles } from '../..'
import { Comp, styled, useOvermind } from './app'
import { Doc } from './Doc'

const MyDrop = styled(Drop)`
  padding: 20px;
  margin: 20px;
  background: #eee;
`

const DropDiv = styled.div`
  padding: 20px;
  margin: 20px;
  background: #eee;
  ${dropStyles};
`

export interface GroupProps {
  className?: string
  group: string
}

export const Group: Comp<GroupProps> = ({ className, group }) => {
  const app = useOvermind()
  const items = app.state.groups[group]
  const { drag } = app.state.dragdrop
  const dragName = drag ? drag.payload.name : undefined
  const list = Object.keys(items || {}).map(k => items[k])
  return (
    <MyDrop
      className={className}
      enable={!items || !items[dragName]}
      drop="doc"
      onDrop={app.actions.group.moveToGroup}
      payload={{ target: group }}
    >
      <h3>(Group: {group})</h3>
      {list.map((props, idx) => (
        <Doc key={idx} group={group} {...props} />
      ))}
    </MyDrop>
  )
}

/** Alternative way to make an element droppable without wrapping in Drop
 * component.
 */
const Group2Comp: Comp<GroupProps> = ({ className, group }) => {
  const app = useOvermind()
  const items = app.state.groups[group]
  const list = Object.keys(items || {}).map(k => items[k])
  return (
    <DropDiv
      {...droppable(app, {
        drop: 'doc',
        onDrop: app.actions.group.moveToGroup,
        payload: { target: group },
      })}
    >
      <h3>(Group2: {group})</h3>
      {list.map((props, idx) => (
        <Doc key={idx} group={group} {...props} />
      ))}
    </DropDiv>
  )
}

export const Group2 = styled(Group2Comp)`
  border: 2px dashed rgba(0, 0, 0, 0); /* empty border to avoid movement on hover */
  padding: 20px;
  margin: 20px;
  background: #dfd;
  &.dropZone {
    animation: DropPulse 2s alternate ease-in-out infinite;
    background-color: rgba(200, 255, 0, 0.4);
  }
  &.dropZone:hover {
    border: 2px dashed orange;
  }
  &.noDrop {
    background: #888;
  }
`

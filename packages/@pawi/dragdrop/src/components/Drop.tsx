import * as React from 'react'
import { Comp, css, styled, theme, useOvermind } from '../app'
import { droppable } from '../droppable'
import { DroppableSettings } from '../types'

export const dropStyles = css`
  position: relative;
  &.dropZone > .dropMark {
    position: absolute;
    z-index: 1;
    animation: DropPulse 2s alternate ease-in-out infinite;
    background-color: rgba(255, 200, 0, 0.2);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border: 2px dashed rgba(0, 0, 0, 0); /* empty border to avoid movement on hover */
  }
  &.dropZone,
  &.fileDrop {
    animation: DropPulse 2s alternate ease-in-out infinite;
    background-color: rgba(255, 200, 0, 0.2);
  }
  &.dropZone:hover > .dropMark,
  &.fileDrop {
    animation: none;
    background-color: rgba(255, 200, 0, 0.2);
    border-color: black;
  }
  &&.noDrop {
    background: ${theme.dropNoDropBackground};
  }
  &&.exist {
    background: ${theme.dropExistBackground};
  }
`

const Wrapper = styled.div`
  ${dropStyles};
`

export const Drop: Comp<DroppableSettings> = ({ children, ...props }) => {
  const ctx = useOvermind()
  return <Wrapper {...droppable(ctx, props)}>{children}</Wrapper>
}

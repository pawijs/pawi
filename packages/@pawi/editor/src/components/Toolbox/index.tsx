import * as React from 'react'

import { Comp, styled, useOvermind } from '../../app'
import { CompositionHolder, ToolboxOpType } from '../../lib'

import { ToolboxMenu } from './ToolboxMenu'
import classnames from 'classnames'

interface ToolpaddingType {
  top: number
  left: { [key: string]: number }
}

const LINE_HEIGHT = 16

// FIXME: try to fix this with CSS
const TOOL_PADDING: ToolpaddingType = {
  top: LINE_HEIGHT + 12,
  left: {
    selection: -32,
    default: -16,
  },
}

export interface ToolboxProps {
  className?: string
  holder: CompositionHolder
  compId: string
}

const Wrapper = styled.div`
  position: absolute;
  background: #f0f0f0;
  border: 1px solid #a0a0a0;
  box-shadow: 1px 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  display: flex;
  z-index: 9;

  &:before,
  & .menu:before {
    position: absolute;
    left: 16px;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    content: '';
  }

  & .menu:before {
    /* arrow up */
    top: -9px;
    border-bottom-color: #f0f0f0;
    border-width: 0 9px 9px;
    margin-left: -9px;
  }

  &:before {
    /* arrow up */
    top: -10px;
    border-bottom-color: #999;
    border-width: 0 10px 10px;
    margin-left: -10px;
  }
  @media print {
    & {
      display: none;
    }
  }
`

export const Toolbox: Comp<ToolboxProps> = function Toolbox({
  className,
  holder,
  compId,
}) {
  // start tracking
  useOvermind()
  const { composition } = holder
  if (!composition) {
    return null
  }
  const toolbox = composition.toolbox
  if (!toolbox || toolbox.type === 'none') {
    return null
  }
  const { type, position } = toolbox as ToolboxOpType

  const editor = document.getElementById(compId)
  const editorRect = (editor && editor.getClientRects()[0]) || {
    top: 0,
    left: 0,
  }

  const style = {
    top: position.top - editorRect.top + TOOL_PADDING.top,
    left:
      position.left -
      editorRect.left +
      (TOOL_PADDING.left[type] || TOOL_PADDING.left.default),
  }
  return (
    <Wrapper className={classnames(className, type)} style={style}>
      <ToolboxMenu type={type} holder={holder} compId={compId} />
    </Wrapper>
  )
}

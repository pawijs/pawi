import { Comp, styled, useOvermind } from '../app'
import { UINodeType } from '../types'
import * as React from 'react'
const DURATION = 1.6

export interface DropTargetProps {
  className?: string
  uinode: UINodeType
  slotIdx: number
}

const Wrapper = styled.g`
  @keyframes centerAnim {
    0% {
      transform: translate(20px, 20px) scale(0.1) translate(-20px, -20px);
      fill: red;
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    10% {
      transform: translate(20px, 20px) scale(1) translate(-20px, -20px);
      opacity: 1;
    }
    90% {
      transform: translate(20px, 20px) scale(0) translate(-20px, -20px);
      fill: orange;
      opacity: 1;
    }
    100% {
      transform: translate(20px, 20px) scale(0) translate(-20px, -20px);
      opacity: 0.5;
    }
  }

  @keyframes ringAnim {
    0% {
      transform: translate(20px, 20px) scale(0.3) translate(-20px, -20px);
      stroke: red;
    }
    30% {
      opacity: 1;
    }
    60% {
      stroke: orange;
      opacity: 1;
    }
    90% {
      opacity: 0;
    }
    100% {
      transform: translate(20px, 20px) scale(1) translate(-20px, -20px);
      opacity: 0;
    }
  }
  & .center {
    animation: centerAnim ${DURATION}s ease infinite;
    fill: orange;
  }

  & .ring1,
  & .ring2 {
    animation: ringAnim ${DURATION}s ease infinite;
    stroke: orange;
    stroke-width: 2px;
    fill: transparent;
  }

  & .ring2 {
    animation-delay: ${0.2 * DURATION}s;
  }
`

export const DropTarget: Comp<DropTargetProps> = ({
  className,
  uinode,
  slotIdx,
}) => {
  useOvermind()
  const slot = uinode.slots[slotIdx]
  let transform = ''
  if (slot) {
    const x = uinode.pos.x + slot.pos.x - 20
    const y = uinode.pos.y + slot.pos.y - 20
    transform = `translate(${x},${y})`
  } else {
    // ??
    const x = uinode.pos.x - 2
    const y = uinode.pos.y - 2
    transform = `translate(${x},${y})`
  }

  return (
    <Wrapper transform={transform} className={className}>
      <circle className="center" r="6" cx="19.5" cy="19.5" />
      <circle className="ring1" r="18" cx="19.5" cy="19.5" />
      <circle className="ring2" r="18" cx="19.5" cy="19.5" />
    </Wrapper>
  )
}

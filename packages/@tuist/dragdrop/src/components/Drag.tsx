import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'

export interface DraggingProps {
  className?: string
}

/* Declare droppulse effect here because we are sure that it will
 * be included first and only once.
 */
const Wrapper = styled.div`
  pointer-events: none;
  position: fixed;
  z-index: 99;

  @keyframes DropPulse {
    0% {
      background-color: rgba(225, 200, 0, 0.1);
    }
    50% {
      background-color: rgba(255, 200, 0, 0.4);
    }
    100% {
      background-color: rgba(255, 200, 0, 0.1);
    }
  }
`

export const Drag: Comp<DraggingProps> = ({ className }) => {
  const app = useOvermind()
  const drag = app.state.dragdrop.drag
  if (!drag) {
    return null
  }

  const position = app.state.dragdrop.position
  const definition = app.state.dragdrop.definitions().types[drag.type]
  if (!definition) {
    throw new Error(
      `Missing component for dragged type '${
        drag.type
      }': no settings found for this type.`
    )
  }
  const anchor = definition.anchor || drag.anchor
  const top = position.y - anchor.y
  const left = position.x - anchor.x
  const Comp = definition.component
  const props = Object.assign({}, definition.dragProps || {}, drag.payload)
  return (
    <Wrapper className={className} style={{ left, top }}>
      <Comp {...props} />
    </Wrapper>
  )
}

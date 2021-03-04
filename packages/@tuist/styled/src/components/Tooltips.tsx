import * as React from 'react'
import styled from 'styled-components'
import { Comp, useOvermind } from '../app'
import { Icon } from './Icon'
import { Tip } from './Tip'

export interface TooltipsProps {
  className?: string
}

const TooltipsIcon = styled(Icon)`
  opacity: 0.2;
  &.highlighted {
    opacity: 1;
  }
`

const MySpan = styled.span`
  &:focus {
    outline: none;
  }
`

export const Tooltips: Comp<TooltipsProps> = ({ className }) => {
  const ctx = useOvermind()
  return (
    <Tip tip="tipTooltipsIcon">
      <MySpan>
        <TooltipsIcon
          className={className}
          highlighted={ctx.state.styled.showTips}
          icon="Tooltips"
          onClick={ctx.actions.styled.toggleTooltips}
        />
      </MySpan>
    </Tip>
  )
}

import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme } from '../../app'

export interface CardContentProps {
  className?: string
  topBorder?: boolean
  bottomBorder?: boolean
}

const Wrapper = styled.div`
  background: ${theme.cardBackground};
  border: ${theme.cardBorder};
  &:not(.topBorder) {
    border-top: none;
  }
  &:not(.bottomBorder) {
    border-bottom: none;
  }
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  position: relative;
`

export const CardContent: Comp<CardContentProps> = ({
  className,
  children,
  topBorder,
  bottomBorder,
}) => (
  <Wrapper className={classnames({ topBorder, bottomBorder }, className)}>
    {children}
  </Wrapper>
)

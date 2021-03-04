import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme } from '../../app'

export interface CardProps {
  className?: string
  large?: boolean
  medium?: boolean
  shadow?: boolean
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: ${theme.cardWidth};
  color: ${theme.cardColor};
  border-radius: ${theme.cardBorderRadius};
  &.medium {
    width: ${theme.cardMediumWidth};
  }
  &.large {
    width: ${theme.cardLargeWidth};
  }
  &.shadow {
    box-shadow: ${theme.cardBoxShadow};
  }
`

export const Card: Comp<CardProps> = ({
  className,
  children,
  large,
  medium,
  shadow,
}) => (
  <Wrapper className={classnames({ large, medium, shadow }, className)}>
    {children}
  </Wrapper>
)

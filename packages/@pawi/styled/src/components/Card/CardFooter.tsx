import * as React from 'react'
import { Comp, styled, theme } from '../../app'

export interface CardFooterProps {
  className?: string
}

const Wrapper = styled.div`
  display: flex;
  min-height: ${theme.cardBorderRadius};
  background: ${theme.cardBackground};
  border: ${theme.cardBorder};
  border-top-width: 0;
  border-bottom-left-radius: ${theme.cardBorderRadius};
  border-bottom-right-radius: ${theme.cardBorderRadius};
`

export const CardFooter: Comp<CardFooterProps> = ({ className, children }) => (
  <Wrapper className={className}>{children}</Wrapper>
)

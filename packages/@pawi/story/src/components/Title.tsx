import * as React from 'react'
import { Comp, styled } from '../app'

interface TitleProps {
  className?: string
  onClick?: (value: any) => any
}

const ATitle = styled.div`
  flex-grow: 1;
  background: #e2e2e2;
  padding: 10px;
  font-size: 0.9rem;
  width: 15rem;
  user-select: none;
  border-right: 1px solid #aaa;
`

export const Title: Comp<TitleProps> = ({ children, className, onClick }) => (
  <ATitle
    className={className}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'inherit' }}
  >
    {children}
  </ATitle>
)

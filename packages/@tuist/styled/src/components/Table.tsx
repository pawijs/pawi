import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme } from '../app'
import { ScrollDiv } from './ScrollDiv'
// https://react-window.now.sh/
// import x from 'react-window'
// dynamic heights...
// https://codesandbox.io/s/dynamic-size-of-react-window-list-items-64o9p?file=/src/ChatMessage.js

export interface TableRowProps {
  className?: string
  // indentation level
  indent?: number
  selected?: boolean
  onClick?: (e: any) => void
  onDoubleClick?: (e: any) => void
}

const RowWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-grow: 0;
  align-items: center;
  border-top: ${theme.tableRowBorder};
  height: ${theme.tableRowHeight};
  padding: ${theme.tableRowPaddingV} ${theme.tableRowPaddingH};
  &:nth-child(even) {
    background: ${theme.tableRowBackgroundEven};
  }
  &:nth-child(odd) {
    background: ${theme.tableRowBackgroundOdd};
  }
  color: ${theme.tableRowColor};
  &.clickable {
    cursor: pointer;
  }
  &.selected {
    font-weight: bold;
  }
  &:first-child {
    border-top-color: transparent;
  }
`

export const TableRow: Comp<TableRowProps> = ({
  className,
  children,
  indent,
  onClick,
  onDoubleClick,
  selected,
  ...props
}) => (
  <RowWrapper
    className={classnames(className, {
      selected,
      clickable: onClick || onDoubleClick,
    })}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    style={
      indent !== undefined
        ? {
            paddingLeft: `calc(${indent}*${theme.tableRowIdent})`,
          }
        : {}
    }
    {...props}
  >
    {children}
  </RowWrapper>
)

export const TableWrapper = styled.div`
  display: flex;
  min-height: 100%;
  flex-grow: 1;
  flex-direction: column;
  background: ${theme.tableBackground};
`

export const Table: Comp<{
  className?: string
}> = function Table({ className, children }) {
  return (
    <ScrollDiv>
      <TableWrapper className={className}>{children}</TableWrapper>
    </ScrollDiv>
  )
}

export const BottomTable: Comp<{
  className?: string
}> = function Table({ className, children }) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  })
  return (
    <ScrollDiv ref={ref as any}>
      <TableWrapper className={className}>{children}</TableWrapper>
    </ScrollDiv>
  )
}

export const TableHeader = styled(TableRow)`
  &:nth-child(odd) {
    color: ${theme.tableHeaderColor};
    background: ${theme.tableHeaderBackground};
  }
  &:nth-child(even) {
    color: ${theme.tableHeaderColor};
    background: ${theme.tableHeaderBackground};
  }
`
TableHeader.displayName = 'TableHeader'

// Is this used ? TODO: Remove if not
export const TableToolbar = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 0.9rem;
  min-height: 2.16rem;
`
TableToolbar.displayName = 'TableToolbar'

// Is this used ? TODO: Remove if not
export const TableTool = styled.span`
  display: flex;
  align-self: center;
  flex-grow: 0;
  padding: 3px 5px;
  margin: 5px;
  border-radius: 3px;
  &.selected {
    background: #aaa;
    cursor: normal;
  }
  cursor: pointer;
  color: #555;
`
TableTool.displayName = 'TableTool'

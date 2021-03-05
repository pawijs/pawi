// import { Dialog } from '@tuist/dialog'
import { Drag } from '@tuist/dragdrop'
import { Tree } from '@tuist/tree-view'
import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import { Comp, styled, useOvermind } from '../app'

const Dialog = React.Fragment

export interface AppProps {
  className?: string
}

const Wrapper = styled.div`
  /* styles here */
`
const TreeWrapper = styled.div`
  margin: 0.5rem;
`

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: #282828;
    font-family: Arial, Helvetica, sans-serif;
    overflow: hidden;
  }
  .Tablet .noTablet {
    display: none;
  }
  @media print {
    .noPrint {
      display: none;
    }
    @page {
      margin: 0;
      size: 210mm 297mm;
    }
    body {
      margin: 0;
    }
  }
`

export const App: Comp<AppProps> = ({ className }) => {
  const ctx = useOvermind()
  const { tree } = ctx.state.tuist
  return (
    <Wrapper className={className}>
      <GlobalStyle />
      <Drag />
      <Dialog>
        <TreeWrapper>
          {tree && <Tree tree={tree} extraProps={{}} />}
        </TreeWrapper>
      </Dialog>
    </Wrapper>
  )
}

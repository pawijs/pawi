// import { Dialog } from '@forten/dialog'
import { Drag, dropStyles, fileDrop } from '@forten/dragdrop'
import { Library, Tree } from '@forten/tree-view'
import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import { Comp, styled, useOvermind } from '../app'
import { Icon } from './Icon'

const Dialog = React.Fragment

export interface AppProps {
  className?: string
}

const Wrapper = styled.div`
  ${dropStyles};
  padding: 0.5rem;
  height: 100%;
`

const TreeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: #282828;
    font-family: Arial, Helvetica, sans-serif;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  #root {
    height: 100%;
    width: 100%;
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
  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
`

export const App: Comp<AppProps> = ({ className }) => {
  const ctx = useOvermind()
  const ref = React.useRef<HTMLElement>(null)
  if (ctx.state.treeEditor.loading) {
    return null
  }
  const { tree } = ctx.state.treeEditor
  const drop = fileDrop({
    ref,
    className,
    accept(item) {
      return item.kind === 'string'
    },
    onDrop(args) {
      ctx.actions.treeEditor.drop(args)
    },
  })
  const { showLibrary } = ctx.state.treeEditor
  return (
    <Wrapper id="app" {...drop}>
      <GlobalStyle />
      <Drag />
      <Dialog>
        <TreeWrapper>
          <Icon
            icon="library"
            onClick={ctx.actions.treeEditor.toggleLibrary}
            highlighted={showLibrary}
          />
          {showLibrary && <Library />}
          {tree && <Tree tree={tree} extraProps={{}} />}
        </TreeWrapper>
      </Dialog>
    </Wrapper>
  )
}

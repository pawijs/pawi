// import { Dialog } from '@forten/dialog'
import { Drag, dropStyles, fileDrop } from '@forten/dragdrop'
import { Icon } from '@forten/styled'
import { Library, Tree } from '@forten/tree-view'
import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import { Comp, styled, useOvermind } from '../app'

const Dialog = React.Fragment

const BarsIcon = styled(Icon)`
  color: #555;
  &.highlighted {
    color: #999;
  }
`

export interface AppProps {
  className?: string
}

const Wrapper = styled.div`
  ${dropStyles};
  min-width: 100vw;
  min-height: 100vh;
  padding: 0.5rem;
`

const TreeWrapper = styled.div`
  display: flex;
  flex-direction: row;
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
  const ref = React.useRef<HTMLElement>(null)
  if (ctx.state.pawi.loading) {
    return null
  }
  const { tree } = ctx.state.pawi
  const drop = fileDrop({
    ref,
    className,
    accept(item) {
      console.log('TEST', item)
      return item.kind === 'string'
    },
    onDrop(args) {
      ctx.actions.pawi.drop(args)
    },
  })
  const { showLibrary } = ctx.state.pawi
  return (
    <Wrapper {...drop}>
      <GlobalStyle />
      <Drag />
      <Dialog>
        <TreeWrapper>
          <BarsIcon
            icon="library"
            onClick={ctx.actions.pawi.toggleLibrary}
            highlighted={showLibrary}
          />
          {showLibrary && <Library />}
          {tree && <Tree tree={tree} extraProps={{}} />}
        </TreeWrapper>
      </Dialog>
    </Wrapper>
  )
}

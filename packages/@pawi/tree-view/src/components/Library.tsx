import { draggable } from '@pawi/dragdrop'
import { Icon, Resizable } from '@pawi/styled'
import { darken } from 'polished'
import * as React from 'react'
import { Comp, css, styled, useOvermind } from '../app'
import { colorName, indices, pfill } from '../helpers'

export interface LibraryProps {
  className?: string
}

const Wrapper = styled(Resizable)`
  padding: 0.5rem;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  width: 10rem;
  min-height: 100vh;
  & .Handle {
    bottom: auto;
    top: 0;
    background: #555;
  }
`

const List = styled.div`
  background: #000;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: absolute;
`

const Scroller = styled.div`
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;

  ::-webkit-scrollbar-track {
    background-color: #333;
    border-left: 1px solid #222;
  }

  ::-webkit-scrollbar {
    width: 10px;
    background-color: #777;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: #000;
  }
`

const Element = styled.div`
  cursor: pointer;
  font-size: 0.8rem;
  ${indices
    .map(
      paletteIdx => css`
        &.box${paletteIdx} {
          background: ${darken(0.2, pfill(paletteIdx))};
        }
      `
    )
    .join('\n')};
  background: #777;
  padding: 3px 8px;
  border-bottom: 1px solid #222;
`

const Search = styled(Element)`
  opacity: 0.2;
`

function scrollStop(this: HTMLDivElement, e: any) {
  // el.scrollTop -= e.wheelDeltaY
  const delta = e.type === 'mousewheel' ? e.wheelDelta : e.detail * -40
  if (
    delta < 0 &&
    this.scrollHeight - this.offsetHeight - this.scrollTop <= 0
  ) {
    this.scrollTop = this.scrollHeight
    e.preventDefault()
  } else if (delta > 0 && delta > this.scrollTop) {
    this.scrollTop = 0
    e.preventDefault()
  }
}

export const Library: Comp<LibraryProps> = ({ className }) => {
  const ctx = useOvermind()
  function setupScroll(el: HTMLDivElement) {
    if (!el) {
      return
    }
    el.addEventListener('mousewheel', scrollStop)
    el.addEventListener('DOMMouseScroll', scrollStop)
  }
  const elements = ctx.state.treeView.library
  return (
    <Wrapper className={className} name="library" type="width">
      <Search>
        <Icon icon="search" />
      </Search>
      <Scroller ref={setupScroll as any}>
        <List>
          {elements.map(el => (
            <Element
              key={el.name}
              className={colorName(el.name)}
              {...draggable(ctx, {
                className: colorName(el.name),
                drag: 'tree',
                payload: { block: el },
              })}
            >
              {el.name}
            </Element>
          ))}
        </List>
      </Scroller>
    </Wrapper>
  )
}

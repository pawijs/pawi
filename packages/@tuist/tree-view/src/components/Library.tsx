import { Icon } from '@tuist/styled'
import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'

export interface LibraryProps {
  className?: string
  focused?: boolean
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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
    background-color: #777;
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
  background: #777;
  padding: 3px 8px;
  border-bottom: 1px solid #222;
`

const Search = Element

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

export const Library: Comp<LibraryProps> = ({ className, focused }) => {
  useOvermind()
  if (!focused) {
    return null
  }
  function setupScroll(el: HTMLDivElement) {
    if (!el) {
      return
    }
    el.addEventListener('mousewheel', scrollStop)
    el.addEventListener('DOMMouseScroll', scrollStop)
  }
  const elements = [
    { name: 'three.cube' },
    { name: 'three.Scene' },
    { name: 'filter.Bar' },
    { name: 'filter.Baz' },
  ]
  return (
    <Wrapper className={className}>
      <Search>
        <Icon icon="search" />
      </Search>
      <Scroller ref={setupScroll as any}>
        <List>
          {elements.map(el => (
            <Element key={el.name} className={classnames(el.name)}>
              {el.name}
            </Element>
          ))}
        </List>
      </Scroller>
    </Wrapper>
  )
}

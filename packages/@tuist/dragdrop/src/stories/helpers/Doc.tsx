import * as React from 'react'
import { draggable, Drop } from '../..'
import { Comp, useOvermind, styled } from './app'

export const MyDoc = styled.div`
  border: 1px solid #888;
  margin: 3px;
  padding: 5px;
  width: 8rem;
  cursor: pointer;
`

export interface DocDrag {
  name: string
  group: string
  isName?: boolean
}

export interface DocProps extends DocDrag {
  // custom prop passed with settings on drag
  myprop?: string
}

export const Doc: Comp<DocProps> = ({ group, myprop, isName, name }) => {
  const app = useOvermind()
  const props = draggable<DocDrag>(app, {
    drag: 'doc',
    payload: { name, isName, group },
    onClick() {
      alert('normal click')
    },
  })
  return (
    <MyDoc {...props}>
      {myprop || null}
      {name}
      {isName ? ' (is name)' : null}
    </MyDoc>
  )
}

export const MyName = styled.div`
  border: 2px solid #888;
  border-radius: 6px;
  background: orange;
  padding: 5px;
  width: 8rem;
  cursor: pointer;
`

export interface NameDrag {
  // payload passed in start drag
  stuff: {
    // We make the payload different from Doc to test
    // transform on drop.
    name: string
    group: string
  }
}

export interface NameProps extends NameDrag {
  // custom prop passed with settings on drag
  myprop?: string
}

// This is very much like Doc but it is used to test transforms. So when
// a Doc element has 'isName', it is changed into a 'Name' drag.
export const Name: Comp<NameProps> = ({ stuff: { name, group } }) => {
  const app = useOvermind()
  const props = draggable<NameDrag>(app, {
    drag: 'name',
    payload: { stuff: { name, group } },
    onClick() {
      alert('normal click')
    },
  })
  return <MyName {...props}>{name}</MyName>
}

export const MyDrop = styled(Drop)`
  padding: 20px;
  margin: 20px;
  background: #eee;
`

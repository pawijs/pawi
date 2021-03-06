import { createHook } from 'overmind-react'
import * as React from 'react'
import { Stories } from '../..'
import { Comp, styled } from '../../app'

interface Config {
  state: {
    foo: string
  }
}
const useOvermind = createHook<Config>()

const Foo: Comp = () => {
  const app = useOvermind()
  return <div>{app.state.foo}</div>
}

const Orange = styled.div`
  padding: 10px;
  background: orange;
`

const component: Comp = function ShowChildren({ children }) {
  return <Orange>{children}</Orange>
}

export const children: Stories<{ name: string }> = {
  name: 'children',
  config: { state: { foo: 'fool' } },
  component,
  stories: [
    {
      name: 'simple',
      children: [<div key="1">Hello</div>, <div key="2">World</div>],
    },
    {
      name: 'with tracking',
      children: [
        <Foo key="1" />,
        <div key="2">Hello</div>,
        <div key="3">World</div>,
      ],
    },
  ],
}

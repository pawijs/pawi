import { IAction } from 'overmind'
import { createHook } from 'overmind-react'
import * as React from 'react'
import styled from 'styled-components'
import { Stories } from '../..'
import { Comp } from '../../app'

interface Config {
  state: {
    barName: string
  }
  actions: {
    doSomething: Action<string>
  }
  effects: {}
}

type Action<Input = any, Output = void> = IAction<Config, Input, Output>

const doSomething: Action<string> = ({ state }, value) => {
  state.barName = value
}

const config = {
  state: {
    barName: 'Mona',
  },
  actions: { doSomething },
}
const useOvermind = createHook<typeof config>()

const Box = styled.div`
  border: 1px solid #999;
  padding: 3px;
  cursor: pointer;
  background: orange;
`

const myComponent: Comp<{ className?: string }> = ({ className }) => {
  const app = useOvermind()
  return (
    <Box
      className={className}
      onClick={() => {
        app.actions.doSomething(app.state.barName === 'Lisa' ? 'Mona' : 'Lisa')
      }}
    >
      {app.state.barName}
    </Box>
  )
}

export const sequencesStories: Stories = {
  name: 'actions',
  stories: [
    {
      name: 'simple',
      component: myComponent,
      config,
    },
  ],
}

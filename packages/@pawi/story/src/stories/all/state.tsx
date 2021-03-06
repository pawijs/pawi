import { themeProxy } from '@pawi/theme'
import { createHook } from 'overmind-react'
import * as React from 'react'
import { Stories } from '../..'
import { Comp, styled } from '../../app'

interface Config {
  state: {
    things: {
      [key: string]: {
        name: string
      }
    }
    otherThings: {
      [key: string]: {
        name: string
      }
    }
    something: string
  }
}

const useOvermind = createHook<Config>()

const selectedTheme = {
  textColor: '#fd50b8',
}

const theming = themeProxy(selectedTheme)

const Wrapper = styled.div`
  color: ${theming.textColor};
  border: 1px solid ${theming.textColor};
  padding: 3px;
`

const component: Comp<{
  className?: string
  id: string
}> = ({ className, id }) => {
  const app = useOvermind()
  return <Wrapper className={className}>{app.state.things[id].name}</Wrapper>
}

export const stateStories: Stories = {
  name: 'state',
  config: {
    state: {
      // To test merging object in StoryDisplay
      otherThings: {},
      // To test theme is used
      theme: {
        selectedTheme,
      },
    },
  },
  stories: [
    {
      name: 'simple',
      component,
      state: {
        things: {
          difool: { name: 'I am John Difool' },
        },
        otherThings: {},
        something: 'hello',
      },
      props: { id: 'difool' },
    },
  ],
}

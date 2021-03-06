import { build, settings } from '@pawi/build'
import { TStories } from '@pawi/story'
import { styled } from '@pawi/styled'
import { IAction } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styledComp from 'styled-components'
import { shortcuts, ShortcutsSettings } from '../..'
import * as actions from './actions'

export { Comp, styledComp as styled }

export interface TestConfig {
  state: {
    test: {
      message: string
    }
  }
  actions: {
    test: {
      setMessage: Action<string>
    }
  }
}

const test = {
  name: 'test',
  settings: settings<ShortcutsSettings<TestConfig>>({
    shortcuts: {
      hello: {
        keys: ['cmd+h'],
        callback(app, payload, e) {
          if (app.state.test.message === 'hello (cmd+h)') {
            return false
          } else {
            app.actions.test.setMessage('hello (cmd+h)')
            return true
          }
        },
      },

      world: {
        keys: ['cmd+h'],
        callback(app, payload, e) {
          if (app.state.test.message === 'world (cmd+h)') {
            return false
          } else {
            app.actions.test.setMessage('world (cmd+h)')
            return true
          }
        },
      },
      up: {
        keys: ['up'],
        callback(app, payload, e) {
          const el = e.target as HTMLElement
          if (el.tagName === 'INPUT') {
            return false
          }
          app.actions.test.setMessage('⇧')
          return true
        },
      },
      down: {
        keys: ['down'],
        callback(app, payload, e) {
          const el = e.target as HTMLElement
          if (el.tagName === 'INPUT') {
            return false
          }
          app.actions.test.setMessage('︎⇩')
          return true
        },
      },
      left: {
        keys: ['left'],
        callback(app, payload, e) {
          const el = e.target as HTMLElement
          if (el.tagName === 'INPUT') {
            return false
          }
          app.actions.test.setMessage('︎⇦')
          return true
        },
      },
      right: {
        keys: ['right'],
        callback(app, payload, e) {
          const el = e.target as HTMLElement
          if (el.tagName === 'INPUT') {
            return false
          }
          app.actions.test.setMessage('︎⇨')
          return true
        },
      },
    },
  }),
  state: {
    test: {
      message: '',
    },
  },
  actions: {
    test: actions,
  },
}

export const config = build(test).using(shortcuts).using(styled).config()

export type Stories<Props = any> = TStories<typeof config, Props>
export type Action<Input = void, Output = void> = IAction<
  TestConfig,
  Input,
  Output
>

export const useOvermind = createHook<TestConfig>()

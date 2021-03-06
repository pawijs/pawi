import { build, settings } from '@pawi/build'
import { HooksSettings } from '@pawi/hooks'
import { TStories } from '@pawi/story'
import { styled as styledBlock, StyledSettings } from '@pawi/styled'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { useragent } from '../'
import { UseragentHooks, UseragentSettings } from '../types'
import { icons } from './icons'

export { Comp, styled }

export const config = build({
  name: 'test',
  settings: settings<
    StyledSettings & UseragentSettings & HooksSettings<UseragentHooks>
  >({
    hooks: {
      useragent_online(ctx, { online }) {
        if (online) {
          ctx.state.test.message = 'We are online :-)'
        } else {
          ctx.state.test.message = 'We are offline :-('
        }
      },
    },
    styled: {
      icons,
    },
  }),
  state: {
    test: {
      message: 'no message',
    },
  },
})
  .using(useragent)
  .using(styledBlock)
  .config()

export const useOvermind = createHook<typeof config>()

export type Stories<Props> = TStories<typeof config, Props>

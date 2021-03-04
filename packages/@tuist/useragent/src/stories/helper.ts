import { StyledSettings, styled as styledBlock } from '@tuist/styled'
import { UseragentHooks, UseragentSettings } from '../types'
import { build, settings } from '@tuist/build'

import { FunctionComponent as Comp } from 'react'
import { HooksSettings } from '@tuist/hooks'
import { TStories } from '@tuist/story'
import { createHook } from 'overmind-react'
import { icons } from './icons'
import styled from 'styled-components'
import { useragent } from '../'
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

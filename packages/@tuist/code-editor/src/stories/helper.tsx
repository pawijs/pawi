import { build, settings } from '@tuist/build'

import { TStories } from '@tuist/story'
import { codeEditor } from '..'
import { createHook } from 'overmind-react'
import { styled } from '../app'
export { styled }

export const config = build({
  name: 'test',
  settings: settings({}),
  state: {
    test: {},
  },
})
  .using(codeEditor)
  .config()

export const useOvermind = createHook<typeof config>()
export type Stories<Props = any> = TStories<typeof config, Props>

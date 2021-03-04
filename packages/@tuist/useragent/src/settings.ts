import { PreferencesHooks, PreferencesSettings } from '@tuist/preferences'

import { Context } from './app'
import { HooksSettings } from '@tuist/hooks'

export const settings: PreferencesSettings & HooksSettings<PreferencesHooks> = {
  preferences: {
    paths: {
      ['useragent.winPosition']: true,
    },
  },
  hooks: {
    preferences_restored(ctx: Context) {
      ctx.actions.useragent.setWinPosition(ctx.state.useragent.winPosition)
    },
  },
}

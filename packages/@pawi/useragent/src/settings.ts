import { HooksSettings } from '@pawi/hooks'
import { PreferencesHooks, PreferencesSettings } from '@pawi/preferences'
import { Context } from './app'

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

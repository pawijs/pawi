import { Block, settings } from '@pawi/build'
import { preferences, PreferencesSettings } from '@pawi/preferences'
import * as actions from './actions'
import { hooksActions } from './hooksActions'
import { onInitialize } from './onInitialize'
import { setup } from './setup'
import { translate } from './translate'
import { LocaleConfig } from './types'

export * from './types'

export const locale: Block<LocaleConfig> = {
  name: 'locale',
  dependencies: [preferences],
  setup,
  onInitialize,
  settings: settings<PreferencesSettings>({
    preferences: {
      paths: {
        'locale.lang': true,
      },
    },
  }),
  actions: {
    hooks: hooksActions,
    locale: actions,
  },
  state: {
    locale: {
      lang: 'en',
      locales: {
        en: {},
        fr: {},
      },
      // This is only set in development
      sources: {},
      common: { en: 'English', de: 'Deutsche', fr: 'Français', it: 'Italiano' },
      translate,
    },
  },
}

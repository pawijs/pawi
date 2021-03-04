import * as actions from './actions'

import { Block, settings } from '@tuist/build'
import { PreferencesSettings, preferences } from '@tuist/preferences'

import { LocaleConfig } from './types'
import { hooksActions } from './hooksActions'
import { onInitialize } from './onInitialize'
import { setup } from './setup'
import { translate } from './translate'

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

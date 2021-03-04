import * as actions from './actions'

import { Hook } from '@tuist/hooks'
import { hooksActions } from './hooksActions'
export const locale_set = 'locale_set'

export interface Locales {
  [lang: string]: {
    [keyAndScope: string]: string
  }
}

export interface LocalesByBlock {
  [block: string]: Locales
}

export interface LocaleSettings {
  locale?: Locales
}

export interface LocaleHooks {
  [locale_set]?: Hook<{ lang: string }>
}

export interface Translate {
  (key: string, replace?: { [key: string]: string }): string
}

export interface LocaleConfig {
  state: {
    locale: {
      // Currently selected lang
      lang: string
      // PRIVATE
      locales: Locales
      // Only in development mode
      sources: LocalesByBlock
      common: { [keyAndScope: string]: string }
      // Compute: returns a function to translate a string using current lang.
      translate: Translate
    }
  }

  actions: {
    hooks: typeof hooksActions
    locale: typeof actions
  }
}

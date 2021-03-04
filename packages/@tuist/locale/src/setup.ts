import { LocaleConfig, LocaleSettings, Locales } from './types'

import { Setup } from '@tuist/build'

export const setup: Setup<LocaleConfig, LocaleSettings> = (
  config,
  settings
) => {
  // Extract all 'locale' fields with translations.
  const locales = config.state.locale.locales
  const common = config.state.locale.common
  const sources: { [key: string]: Locales } = {}
  Object.keys(settings).forEach(blockName => {
    const dictionaries = settings[blockName]
    // istanbul ignore next
    if (process.env.NODE_ENV !== 'production') {
      sources[blockName] = JSON.parse(JSON.stringify(dictionaries))
    }
    Object.keys(dictionaries).forEach(lang => {
      if (lang === 'common') {
        Object.assign(common, dictionaries[lang])
      } else {
        if (!locales[lang]) {
          locales[lang] = {}
        }
        // Last defined translation for conflicting keys wins.
        Object.assign(locales[lang], dictionaries[lang])
      }
    })
  })
  // istanbul ignore next
  if (process.env.NODE_ENV !== 'production') {
    config.state.locale.sources = sources
  }
}

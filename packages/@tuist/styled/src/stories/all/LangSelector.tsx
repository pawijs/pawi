import { LangSelector as component, LangSelectorProps } from '../..'
import { config, Stories } from '../helpers'

export const langSelector: Stories<LangSelectorProps> = {
  name: 'LangSelector',
  component,
  config,
  stories: [
    {
      name: 'simple',
    },
    {
      name: 'single lang',
      state: {
        locale: {
          lang: 'en',
          locales: {
            en: {},
          },
        },
      },
    },
  ],
}

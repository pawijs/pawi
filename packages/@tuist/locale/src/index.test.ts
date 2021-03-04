import { LocaleHooks, locale_set } from './types'
import { LocaleSettings, locale } from '.'
import { build, settings } from '@tuist/build'
import { describe, expect, it } from 'test'

import { HooksSettings } from '@tuist/hooks'

export const foo = {
  name: 'foo',
  state: {
    foo: {
      test: '',
    },
  },
  settings: settings<LocaleSettings & HooksSettings<LocaleHooks>>({
    hooks: {
      [locale_set]: (ctx, { lang }) => {
        ctx.state.foo.test = lang
      },
    },
    locale: {
      common: { UserIcon: 'fa-user' },
      fr: { foo: 'le fou' },
      en: { foo: 'foobar' },
    },
  }),
}

const bar = {
  name: 'bar',
  settings: settings<LocaleSettings>({
    locale: {
      fr: { bar: 'le bar' },
      en: { bar: 'barman' },
      de: { bar: 'Barmann' },
    },
  }),
}

describe('locale', () => {
  it('parse all locales', () => {
    const config = build(locale).using(foo).using(bar).config()
    expect(config.state.locale).toEqual({
      common: {
        UserIcon: 'fa-user',
        en: 'English',
        fr: 'Français',
        it: 'Italiano',
      },
      lang: 'en',
      locales: {
        en: {
          bar: 'barman',
          foo: 'foobar',
        },
        fr: {
          bar: 'le bar',
          foo: 'le fou',
        },
        de: {
          bar: 'Barmann',
        },
      },
      sources: {
        bar: {
          de: {
            bar: 'Barmann',
          },
          en: {
            bar: 'barman',
          },
          fr: {
            bar: 'le bar',
          },
        },
        foo: {
          common: {
            UserIcon: 'fa-user',
          },
          en: {
            foo: 'foobar',
          },
          fr: {
            foo: 'le fou',
          },
        },
      },
      translate: config.state.locale.translate,
    })
  })
})

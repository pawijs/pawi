import * as actions from './actions'

import { IAction, Overmind } from 'overmind'
import { LocaleSettings, locale } from '@tuist/locale'
import { StyledSettings, styled } from '../..'
import { build, settings } from '@tuist/build'

import { TStories } from '@tuist/story'
import { createHook } from 'overmind-react'
import { family } from './family'
import { icons } from './icons'
import { inspector } from './inspector'
import { theme } from '@tuist/theme'

const test = {
  name: 'test',
  settings: settings<StyledSettings & LocaleSettings>({
    styled: {
      icons,
      family,
      inspector,
    },
    locale: {
      ru: {
        Hello: 'привет',
      },
      en: {
        adminCheckbox: 'admin',
        usernamePlaceholder: 'Your username',
        userTip: 'This is the user tip',
        enterUsername: 'Enter your username',
        passwordPlaceholder: 'Password',
        Close: 'Close',
        DearFriend: 'Dear FRIEND, I love you.',
        Validate: "Let's go!",
        Welcome: 'Welcome to styled !',
        InvalidUsernameOrPassword: 'Invalid username or password.',
        Loading: 'App is loading...',
        PleaseLogin: 'Please enter your credentials...',
        Login: 'Login',
        LoginTitle: 'Login to yourself',
        Cancel: 'Cancel',
        TooManyEmotions: 'Too many emotions !',
        Hello: 'Hello World!',
        ru: 'Russian',
        fr: 'French',
        hin: 'Hindi',
      },
      // Just to have more than one lang for LangSelector display.
      fr: {
        Hello: 'Bonjour',
      },
      common: {
        en: 'English',
        fr: 'Français',
        de: 'Deutsche',
      },
    },
  }),

  state: {
    login: {
      error: 'InvalidUsernameOrPassword',
      admin: false,
      username: '',
    },
    test: {
      open: false,
      lang: 'fr',
      hasDocument: true,
    },
  },
  actions,
}

export const config = build(test)
  .using(locale) // uses preferences
  .using(styled)
  .using(theme)
  .config()

export const config2 = build({
  name: 'test2',
  settings:
    // for coverage
    { styled: {} },
})
  .using(locale)
  .using(styled)
  .using(theme)
  .config() as typeof config // cheating to have empty iconProvider.

export type TestConfig = typeof config
export type TestApp = Overmind<TestConfig>
export type Stories<Props = any> = TStories<typeof config, Props>
export type Action<Input = void, Output = void> = IAction<
  TestConfig,
  Input,
  Output
>
export const useOvermind = createHook<TestConfig>()

import { build, settings } from '@tuist/build'
import { describe, expect, it } from 'test'

import { ThemeSettings } from '../src'
import { theme } from './'

describe('theme block', () => {
  it('should parse all themes', () => {
    const foo = {
      name: 'foo',
      state: {
        hop: 'onp',
      },
      settings: settings<ThemeSettings>({
        theme: {
          bong: {
            one: 'foo bong one',
            two: 'foo bong two',
          },
          bang: {
            one: 'foo bang one',
            two: 'foo bang two',
          },
        },
      }),
    }

    const bar = {
      name: 'bar',
      settings: settings<ThemeSettings>({
        theme: {
          bong: {
            two: 'bar bong two',
          },
          bang: {
            one: 'bar bang one',
          },
        },
      }),
    }
    // bar comes first so overwrites foo
    const app = build(bar).using(foo).using(theme).app()

    expect(app.state).toMatchObject({
      theme: {
        selected: 'default',
        selectedTheme: {},
        themes: {
          bong: {
            one: 'foo bong one',
            two: 'bar bong two',
          },
          bang: {
            one: 'bar bang one',
            two: 'foo bang two',
          },
          default: {},
        },
      },
    })
  })
})

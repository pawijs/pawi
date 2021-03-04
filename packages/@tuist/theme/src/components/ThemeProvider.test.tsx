import * as React from 'react'

import { DirectThemeProvider, ThemeProvider } from './ThemeProvider'
import { build, settings } from '@tuist/build'
import { expect, it, testRender } from 'test'

import { ThemeSettings } from '../types'
import { defaultTheme } from '../themes'
import { theme } from '..'

const main = {
  name: 'main',
  settings: settings<ThemeSettings>({
    theme: {
      default: { thisWidth: '12px' },
    },
  }),
}

const app = build(main).using(theme).app()

describe('ThemeProvider', () => {
  it('should render children', () => {
    expect(
      testRender(app, <ThemeProvider scopeName="foo">foobar</ThemeProvider>)
    ).toMatchSnapshot()
  })
})

describe('DirectThemeProvider', () => {
  it('should render with provided theme and scopeName', () => {
    expect(
      testRender(
        <DirectThemeProvider scopeName="bar" theme={defaultTheme}>
          foobar
        </DirectThemeProvider>
      )
    ).toMatchSnapshot()
  })
  it('should render with provided theme and default scopeName', () => {
    expect(
      testRender(
        <DirectThemeProvider theme={defaultTheme}>foobar</DirectThemeProvider>
      )
    ).toMatchSnapshot()
  })
})

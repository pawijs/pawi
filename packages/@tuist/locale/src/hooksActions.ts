import { locale_set } from './types'
import { makeHook } from '@tuist/hooks'

export const hooksActions = {
  [locale_set]: makeHook<{ lang: string }>(locale_set),
}

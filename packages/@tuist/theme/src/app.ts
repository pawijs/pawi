import { derived } from 'overmind'
import { createHook } from 'overmind-react'
import { ThemeConfig } from './types'
import { FunctionComponent as Comp } from 'react'
export { Comp }

export type Config = ThemeConfig

export const useOvermind = createHook<ThemeConfig>()

export function derive<Value>(
  cb: (state: Config['state']['theme'], rootState: Config['state']) => Value
) {
  return derived(cb)
}

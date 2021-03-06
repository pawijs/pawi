import { Setup } from '@pawi/build'
import { Hook, HooksConfig, HooksSettings } from './types'

export const setup: Setup<HooksConfig, HooksSettings<any>> = (
  config,
  settings
) => {
  // Extract all 'locale' fields with translations.
  const hookLists: { [key: string]: Hook[] } = {}
  Object.keys(settings).forEach(blockName => {
    const hooks = settings[blockName]
    Object.keys(hooks).forEach(hookName => {
      if (!hookLists[hookName]) {
        hookLists[hookName] = []
      }
      hookLists[hookName].unshift(hooks[hookName])
    })
  })
  config.state.hooks = hookLists
}

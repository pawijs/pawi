import { Setup } from '@pawi/build'
import { makeSave } from './actions/makeSave'
import {
  PreferencesConfig,
  PreferencesPaths,
  PreferencesSettings,
} from './types'

export const setup: Setup<PreferencesConfig, PreferencesSettings> = (
  config,
  settings
) => {
  // Extract all 'locale' fields with translations.
  let throttleDelay = 1000
  const allPaths: PreferencesPaths = {}
  const allDefaults: { [path: string]: any } = {}

  Object.keys(settings).forEach(blockName => {
    const { paths, defaults, throttle, ...prefs } = settings[blockName]
    if (paths) {
      Object.assign(allPaths, paths)
    }
    if (defaults) {
      Object.assign(allDefaults, defaults)
    }
    if (throttle !== undefined) {
      throttleDelay = throttle
    }
    Object.assign(config.state.preferences, prefs)
  })

  config.state.preferences.paths = Object.keys(allPaths).filter(
    k => allPaths[k]
  )
  config.state.preferences.defaults = allDefaults

  config.actions.preferences.save = makeSave(throttleDelay)
}

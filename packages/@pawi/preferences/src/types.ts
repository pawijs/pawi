import { Hook } from '@pawi/hooks'
import * as actions from './actions'
import { hooksActions } from './hooksActions'
export const PREFERENCES_KEY = 'pawi/preferences'
export const preferences_restore = 'preferences_restore'
export const preferences_clear = 'preferences_clear'
export const preferences_restored = 'preferences_restored'
export const preferences_save = 'preferences_save'

// Dot based paths
export interface PreferencesPaths {
  // If not true: do not track.
  // We use an object so that libraries can
  // overwride previous settings with 'false'.
  [path: string]: boolean
}

export interface PreferencesSettings {
  preferences?: {
    paths?: PreferencesPaths
    defaults?: { [path: string]: any }
    // Delay in milliseconds between save operations. Default
    // is 3 seconds (3000)
    throttle?: number
    // App name when storing to localStorage. Defaults to 'lucy'.
    // The storage key is 'appName_preferences'.
    appName?: string
    // App website
    appWebsite?: string
  }
}

export interface ChangedArg {
  changed: { [path: string]: boolean }
}

export interface PreferencesHooks {
  [preferences_clear]?: Hook<undefined>
  [preferences_restore]?: Hook<undefined>
  [preferences_restored]?: Hook<undefined>
  [preferences_save]?: Hook<{ path: string; value: any }>
}

// Remove TS error on action rewrite in setup
const actionsNotReadonly = { ...actions }

export interface PreferencesConfig {
  state: {
    preferences: {
      appName: string
      appWebsite: string

      // PRIVATE
      // List of dot encoded paths that have changed. The latest value
      // will be saved on after throttle timer.
      changed: { [path: string]: boolean }
      // PRIVATE: list of watched paths
      paths: string[]
      // PRIVATE: only exists on app setup (must be set through pref settings)
      defaults: { [path: string]: any }
      restoring?: boolean
    }
  }

  actions: {
    preferences: typeof actionsNotReadonly
    hooks: typeof hooksActions
  }
}

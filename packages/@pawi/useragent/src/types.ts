import { Hook } from '@pawi/hooks'
import { Parser } from 'bowser'
import * as actions from './actions'
import { AppUpdateInfo } from './helpers/appUpdate.types'
import { WinPosition } from './helpers/winPosition.types'
import { hooksActions } from './hooksActions'

export const useragent_network = 'useragent_network'
export const useragent_online = 'useragent_online'
export const useragent_focus = 'useragent_focus'
// Called before app is restarted (should be interrupted if there is unsaved data)
export const useragent_restart = 'useragent_restart'
export const useragent_blur = 'useragent_blur'
// If the browser is not compatible: throw an Error. Returning false will only stop
//
export const useragent_invalidBrowser = 'useragent_invalidBrowser'

export interface UseragentSetting {
  // Path to service worker
  serviceWorker?: string
  // This value is in seconds (0 = never). Default = 0
  updateCheckInterval?: number
  // Set to true for prerelase app updates
  allowPrerelease?: boolean
  // Browser requirements (Bowser compatible entries for 'satisfies' function call).
  browserRequirements?: { [key: string]: any }
  // Browser download url
  browserDownloadUrl?: string
}

export interface UseragentHooks {
  [useragent_online]?: Hook<{ online: boolean }>
  [useragent_network]?: Hook<{ network: boolean }>
  [useragent_focus]?: Hook<{ focus: boolean }>
  [useragent_restart]?: Hook
  [useragent_blur]?: Hook<{ focus: boolean }>
  // This hook is mostly here to help display proper messages in case of invalid browser (does not
  // meet the requirements).
  [useragent_invalidBrowser]?: Hook<{ browser: Parser.ParsedResult }>
}

export interface UseragentSettings {
  useragent?: UseragentSetting
}

export interface UseragentConfig {
  state: {
    useragent: {
      winPosition: WinPosition
      browser: Parser.ParsedResult
      // Browser requirements (Bowser compatible entries for 'satisfies' function call). If this fails, the
      // useragent_badBrowser hook is called and 'init' is halted.
      browserRequirements: { [key: string]: any }
      browserDownloadUrl: string
      // This is set to true if app servers are online
      appOnline: boolean
      // This is set to true if global network exists
      hasNetwork: boolean
      // This is set to true when everything is online (changes here
      // trigger hooks useragent_online and useragent_offline)
      online: boolean
      // Current tab has focus
      focus: boolean
      hasUpdate?: AppUpdateInfo
      // Internal
      options: {
        serviceWorker?: string
        // This value is in seconds (0 = never). Default = 0
        updateCheckInterval: number
        // On update do we allow prerelase
        allowPrerelease: boolean
      }
    }
  }
  actions: {
    hooks: typeof hooksActions
    useragent: typeof actions
  }
}

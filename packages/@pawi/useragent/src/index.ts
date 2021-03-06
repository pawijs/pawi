import { Block } from '@pawi/build'
import { hooks } from '@pawi/hooks'
import * as actions from './actions'
import { hooksActions } from './hooksActions'
import { onInitialize } from './onInitialize'
import { settings } from './settings'
import { setup } from './setup'
import { UseragentConfig } from './types'

export * from './helpers'
export * from './types'

export const useragent: Block<UseragentConfig> = {
  name: 'useragent',
  dependencies: [hooks],
  setup,
  onInitialize,
  settings,
  state: {
    useragent: {
      // default
      winPosition: {
        x: 100,
        y: 100,
        width: 1024,
        height: 800,
        // This means it can be overriden by
        // the default value.
        default: true,
      },
      // Dummy value. Filled on initialize.
      browser: {} as any,
      // Dummy value, Filled on setup.
      browserRequirements: {},
      browserDownloadUrl: 'https://www.google.com/chrome',
      // This reflects the network app capacity (remote server).
      appOnline: false,
      // This reflects navigator.onLine
      hasNetwork: false,
      // This reflects both network and app capacity (both need to be online for this
      // to be true)
      online: false,
      focus: false,
      options: {
        updateCheckInterval: 0,
        allowPrerelease: false,
      },
    },
  },
  actions: {
    hooks: hooksActions,
    useragent: actions,
  },
}

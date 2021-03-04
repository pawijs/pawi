import { UseragentConfig, UseragentSetting, UseragentSettings } from './types'

import { Setup } from '@tuist/build'

export const setup: Setup<
  UseragentConfig,
  UseragentSettings,
  UseragentSetting
> = (config, blockSettings) => {
  const useragent = config.state.useragent
  Object.keys(blockSettings).forEach(blockName => {
    const setting = blockSettings[blockName]
    if (setting.serviceWorker) {
      useragent.options.serviceWorker = setting.serviceWorker
    }
    if (setting.updateCheckInterval !== undefined) {
      useragent.options.updateCheckInterval = setting.updateCheckInterval
    }
    if (setting.allowPrerelease !== undefined) {
      useragent.options.allowPrerelease = setting.allowPrerelease
    }
    if (setting.browserRequirements) {
      Object.assign(useragent.browserRequirements, setting.browserRequirements)
    }
    if (setting.browserDownloadUrl) {
      useragent.browserDownloadUrl = setting.browserDownloadUrl
    }
  })
}

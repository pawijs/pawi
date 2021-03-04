import { ShortcutDefinition, ShortcutsConfig, ShortcutsSettings } from './types'

import { Setup } from '@tuist/build'

export const setup: Setup<ShortcutsConfig, ShortcutsSettings> = (
  config,
  settings
) => {
  const allShortcuts: { [cmd: string]: ShortcutDefinition[] } = {}
  const definitions: { [name: string]: string[] } = {}
  Object.keys(settings).forEach(modName => {
    const shortcuts = settings[modName]

    Object.keys(shortcuts).forEach(shortcutName => {
      const shortcutDefinition = shortcuts[shortcutName]

      // This is just for help.
      const name = `${modName}-${shortcutName}`
      definitions[name] = shortcutDefinition.keys

      shortcutDefinition.keys.forEach(cmd => {
        let list = allShortcuts[cmd]
        if (!list) {
          allShortcuts[cmd] = [shortcutDefinition]
        } else {
          list.push(shortcutDefinition)
        }
      })
    })
  })

  config.state.shortcuts = {
    settings: () => allShortcuts,
    definitions,
  }
}

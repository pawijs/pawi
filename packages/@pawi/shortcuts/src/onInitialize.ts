import { Overmind } from 'overmind'
import { Action } from './app'
import { makeCommand } from './command'
import { ShortcutsConfig } from './types'

const NO_SHORCUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'BUTTON']

export const onInitialize: Action<Overmind<ShortcutsConfig>> = (ctx, app) => {
  const allShortcuts = ctx.state.shortcuts.settings()

  // FIXME: PERFORMANCE: How much does this slow down editing ?
  function runShortcut(
    e: KeyboardEvent,
    context?: string,
    extraPayload?: { [key: string]: any }
  ) {
    const el = e.target as HTMLElement
    const cmd = makeCommand(e)
    if (el && !cmd.includes('+') && NO_SHORCUT_TAGS.includes(el.tagName)) {
      return false
    }

    const shortcuts = context
      ? allShortcuts[`${context}-${cmd}`]
      : allShortcuts[cmd]
    if (shortcuts) {
      for (const shortcut of shortcuts) {
        const payload = extraPayload
          ? Object.assign({}, extraPayload, shortcut.payload || {})
          : shortcut.payload
        if (shortcut.callback(ctx, payload, e)) {
          // done
          e.preventDefault()
          e.stopPropagation()
          return true
        }
      }
    }
    return false
  }
  ctx.effects.shortcuts.run = runShortcut

  // istanbul ignore next
  if (process.env.NODE_ENV === 'test') {
    // @ts-ignore
    global.runShortcut = runShortcut
  } else {
    document.addEventListener('keydown', runShortcut)
  }
}

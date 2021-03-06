import { isCommand } from '@pawi/useragent'
import { reverseKeycodes } from './keycodes'

export interface CommandEvent {
  ctrlKey?: boolean
  metaKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  keyCode?: number
}

export function sanitizeCommandEvent(e: CommandEvent): CommandEvent {
  return {
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey,
    keyCode: e.keyCode,
  }
}

export function makeCommand(e: CommandEvent) {
  const cmd: string[] = []
  if (isCommand(e)) {
    cmd.push('cmd')
  }
  if (e.altKey) {
    cmd.push('alt')
  }
  if (e.shiftKey) {
    cmd.push('shift')
  }
  cmd.push(reverseKeycodes[e.keyCode || ''])
  return cmd.join('+')
}

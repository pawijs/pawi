import { describe, expect, it } from 'test'
import { makeCommand } from './command'
import { keycodes } from './keycodes'

describe('makeCommand', () => {
  it('should create command from event', () => {
    expect(makeCommand({ altKey: true, keyCode: keycodes['p'] })).toBe('alt+p')
    expect(
      makeCommand({
        altKey: true,
        shiftKey: true,
        keyCode: keycodes['x'],
      })
    ).toBe('alt+shift+x')
    expect(makeCommand({ ctrlKey: true, keyCode: keycodes['p'] })).toBe('cmd+p')
    // not on mac for testing
    expect(makeCommand({ metaKey: true, keyCode: keycodes['p'] })).toBe('p')
    expect(makeCommand({ keyCode: keycodes['up'] })).toBe('up')
  })
})

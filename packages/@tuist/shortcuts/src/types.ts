import { IContext } from 'overmind'

export interface ShortcutDefinition<Config = any> {
  // Returning `true` indicates that we have dealt with the event.
  callback: (ctx: IContext<Config>, payload: any, e: KeyboardEvent) => boolean
  keys: string[]
  payload?: any
}

export interface Shortcuts<Config = any> {
  [name: string]: ShortcutDefinition<Config>
}

export interface ShortcutsSettings<Config = any> {
  shortcuts?: Shortcuts<Config>
}

export interface ShortcutsConfig {
  effects: {
    shortcuts: {
      run(
        e: KeyboardEvent,
        context?: string,
        extraPayload?: { [key: string]: any }
      ): boolean
    }
  }
  state: {
    shortcuts: {
      // This is set during build
      settings: () => { [cmd: string]: ShortcutDefinition[] }
      definitions: {
        // Just an indication of the existing shortcuts in the app (for debugging).
        [name: string]: string[]
      }
    }
  }
}

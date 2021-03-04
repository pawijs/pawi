import { AsyncHook, Hook, HooksConfig, HooksSettings } from './types'
import { Block, build, settings } from '@tuist/build'
import { describe, it, restore } from 'test'
import { makeAsyncHook, makeHook } from './helpers'

import { IAction } from 'overmind'
import { hooks } from '.'

// ================ BAR Block definition

// can be any name, normaly prefixed with block name
const bar_hook = 'bar:hook'
const bar_asynchook = 'bar:asynchook'
const bar_badhook = 'bar:badhook'

interface BarHooks {
  [bar_hook]?: Hook<{ test: string[] }>
  [bar_asynchook]?: AsyncHook<{ test: string[] }>
  [bar_badhook]?: Hook<{ test: string[] }>
}

interface BarConfig {
  actions: {
    hooks: {
      myHook: Action<{ test: string[] }>
      asyncHook: AsyncAction<{ test: string[] }>
      badHook: Action<{ test: string[] }>
      voidHook: Action
      voidAsyncHook: Action
    }
  }
}

type Config = HooksConfig & BarConfig

type Action<Input = any, Output = any> = IAction<Config, Input, Output>
type AsyncAction<Input = any, Output = any> = IAction<
  Config,
  Input,
  Promise<Output>
>

const bar: Block<BarConfig> = {
  name: 'bar',
  actions: {
    hooks: {
      // hooks
      myHook: makeHook(bar_hook),
      asyncHook: makeAsyncHook(bar_asynchook),
      badHook: makeHook(bar_badhook),
      voidHook: makeHook('bad_key'),
      voidAsyncHook: makeAsyncHook('other_bad_key'),
    },
  },
  dependencies: [hooks],
}

// =========== foo uses Bar and sets a hook

const foo = {
  name: 'foo',
  settings: settings<HooksSettings<BarHooks>>({
    hooks: {
      [bar_hook]: (ctx, { test }) => {
        test.push('bar:hook in foo')
      },
      [bar_asynchook]: (ctx, { test }) => {
        // async hook
        return new Promise(resolve => {
          test.push('bar:asynchook in foo')
          resolve()
        })
      },
      [bar_badhook]: function foo(ctx, { test }) {
        // bad async hook in sync
        return new Promise(resolve => {
          test.push('bar:asynchook in foo')
          resolve()
        }) as any
      },
    },
  }),
  dependencies: [bar],
}

const baz = {
  name: 'bay',
  settings: settings<HooksSettings<BarHooks>>({
    hooks: {
      [bar_hook]: (ctx, { test }) => {
        test.push('bar:hook in baz')
      },
    },
  }),
  dependencies: [bar],
}

// Test

const app = build(foo).using(baz).using(bar).app()

describe('hooks', () => {
  afterEach(restore)
  it('should call hooks in correct order', async () => {
    const test: string[] = []
    app.actions.hooks.myHook({ test })
    await app.actions.hooks.asyncHook({ test })

    expect(test).toEqual([
      'bar:hook in foo',
      'bar:hook in baz',
      'bar:asynchook in foo',
    ])
  })

  it('should break on async hook in sync call', () => {
    expect(() => app.actions.hooks.badHook({ test: [] })).toThrow(
      `Cannot run synchronous hook 'bar:badhook': some hooks are async`
    )
  })

  it('should ignore if no hooks are defined', () => {
    expect(() => app.actions.hooks.voidHook({})).not.toThrow()
  })

  it('should ignore if no async hooks are defined', () => {
    expect(() => app.actions.hooks.voidAsyncHook({})).not.toThrow()
  })
})

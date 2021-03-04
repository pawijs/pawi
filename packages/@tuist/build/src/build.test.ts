import { IAction, Overmind } from 'overmind'
import { describe, expect, it, restore } from 'test'
import { Block, build, settings } from './'
import { Setup } from './types'
import simple from 'simple-mock'

const foo = {
  name: 'foo',
  state: {
    foo: {
      hop: 'hop',
    },
  },
  actions: {
    foobar: {
      foo: () => {},
    },
  },
}

type Action<Input = any, Output = any> = IAction<typeof foo, Input, Output>

const doBar: Action<undefined> = () => {}

const bar = {
  name: 'bar',
  state: {
    bar: 'barman',
  },
  actions: {
    doBar,
    foobar: {
      bar: () => {},
    },
  },
  effects: {
    api: {},
  },
  settings: {
    bong: 'bong',
  },
}

const foobaz = {
  name: 'foobaz',
  init() {},
  state: {
    foo: {
      baz: 'baz',
    },
  },
}

type BongSettings = {
  bong: string
}

const bongApp: Block<{}, BongSettings> = {
  name: 'bongApp',
  settings: {
    bong: 'bongApp settings',
  },
}

const bongUser = {
  name: 'bongUser',
  settings: {
    bong: 'bongUser settings',
  },
}

describe('build', () => {
  afterEach(restore)
  it('should deep merge state', () => {
    const config = build(foo).using(bar).using(foobaz).config()
    expect(config.state).toEqual({
      foo: { hop: 'hop', baz: 'baz' },
      bar: 'barman',
    })
  })

  it('should deep merge actions', () => {
    const config = build(foo).using(bar).config()
    expect(Object.keys(config.actions.foobar).sort()).toEqual(['bar', 'foo'])
  })

  it('should deep copy array', () => {
    const blob = {
      name: 'blob',
      state: {
        blob: {
          list: ['1', '2'],
        },
      },
      actions: {
        blob: {
          push: (ctx: any, value: string) => {
            ctx.state.blob.list.push(value)
          },
        },
      },
    }
    const app1 = build(blob).app()
    const app2 = build(blob).app()
    app1.actions.blob.push('3')
    expect(app1.state.blob.list).toEqual(['1', '2', '3'])
    expect(app2.state.blob.list).toEqual(['1', '2'])
  })

  it('should produce app', () => {
    const app = build(foo).using(bar).using(foobaz).app()
    expect(app instanceof Overmind).toBe(true)
  })

  it('should throw `missing config() or app()`', () => {
    const config: any = build(foo).using(bar).using(foobaz)
    expect(config.state.message).toEqual(
      `Please run 'config()' or 'app()' to finish build.`
    )
  })

  it('should merge from last to first', () => {
    const config = build({ name: 'foo', state: { foo: 'foo' } })
      .using({
        name: 'bar',
        state: { foo: 'baz' },
      })
      .app()
    expect(config.state).toEqual({ foo: 'foo' })
  })

  it('should produce state type', () => {
    const config = build(foo).using(bar).using(foobaz).app()
    const x = config.state.foo.baz
    // Should not pass for TS
    // @ts-ignore
    const s = config.settings
    expect(x).toEqual('baz')
    expect(s).toBe(undefined)
  })

  it('should throw on incompatible types', () => {
    expect(() =>
      build({ name: 'app', state: { b: 'x' } })
        .using({ name: 'foo', state: { b: { c: 'c' } } })
        .app()
    ).toThrow(
      `Cannot merge: incompatible types at path 'state.b' (block 'app' has 'string' instead of 'object').`
    )
  })

  it('should throw on incompatible types (non-objects)', () => {
    expect(() =>
      build({ name: 'app', state: { b: 4 } })
        .using({ name: 'foo', state: { b: 'c' } })
        .app()
    ).toThrow(
      `Cannot merge: incompatible types at path 'state.b' (block 'app' has 'number' instead of 'string').`
    )
  })

  it('should run init with all settings', () => {
    let test: any = 'init not run'
    const bong: Block<{}, BongSettings> = {
      name: 'bong',
      setup(_config, settings) {
        test = settings
      },
    }
    build(bongApp).using(bongUser).using(bong).app()
    expect(test).toEqual({
      bongApp: 'bongApp settings',
      bongUser: 'bongUser settings',
    })
  })

  it('should pass settings in using order', () => {
    let test: string[] = []
    const bong: Block<{}, BongSettings> = {
      name: 'bong',
      setup(_config, settings) {
        test = Object.keys(settings)
      },
    }
    build(bongApp).using(bongUser).using(bong).app()
    expect(test).toEqual(['bongUser', 'bongApp'])
  })

  it('should throw on redefined actions', () => {
    const a = {
      name: 'a',
      actions: {
        doThis() {},
      },
    }
    const b = {
      name: 'b',
      actions: {
        doThis() {},
      },
    }
    expect(() => build(a).using(b).app()).toThrow(
      `Cannot redefine 'actions.doThis'.`
    )
  })

  it('should throw on action with object', () => {
    const a = {
      name: 'a',
      actions: {
        foo: {
          doThis() {},
        },
      },
    }
    const b = {
      name: 'b',
      actions: {
        foo() {},
      },
    }
    expect(() => build(a).using(b).app()).toThrow(
      `Cannot redefine 'actions.foo'.`
    )
  })

  it('should throw on invalid type', () => {
    const a = {
      name: 'a',
      actions: {
        foo: {
          doThis: [],
        },
      },
    }
    const b = {
      name: 'b',
      actions: {},
    }
    expect(() => build(a).using(b).app()).toThrow(
      `Value at 'actions.foo.doThis' is not a function.`
    )
  })

  it('should run setup without settings', () => {
    let test = ''
    const a = {
      name: 'a',
      setup() {
        test = 'setup'
      },
    }
    build(a).config()
    expect(test).toBe('setup')
  })

  it('should throw on redefined effects', () => {
    const a = {
      name: 'a',
      effects: {
        api: { blah() {} },
      },
    }
    const b = {
      name: 'b',
      effects: {
        api: { blah() {} },
      },
    }
    expect(() => build(a).using(b).app()).toThrow(
      `Cannot redefine 'effects.api.blah'.`
    )
  })

  it('should add dependencies', () => {
    const d = {
      name: 'd',
      state: {
        d: 'd',
      },
    }
    const c = {
      name: 'c',
      state: {
        c: 'c',
      },
    }
    const b = {
      name: 'b',
      state: {
        b: 'b',
      },
      dependencies: [c],
    }
    const a = {
      name: 'a',
      state: {
        a: 'a',
      },
      dependencies: [b, c, d],
    }
    expect(build(a).config().state).toEqual({ a: 'a', b: 'b', c: 'c', d: 'd' })
  })

  it('should throw on missing name', () => {
    simple.mock(console, 'log').callFn(() => {})
    expect(() => build({ state: {} } as any).config()).toThrow(``)
  })

  it('should parse initializers', async () => {
    const test: string[] = []
    const app = build({
      name: 'foo',
      onInitialize: () => test.push('foo'),
    })
      .using({
        name: 'bar',
        onInitialize: () => test.push('bar'),
      })
      .app()
    await app.initialized
    expect(test).toEqual(['bar', 'foo'])
  })

  it('should halt on false return', async () => {
    const test: string[] = []
    const app = build({
      name: 'foo',
      onInitialize: () => {
        test.push('foo')
      },
    })
      .using({
        name: 'bar',
        onInitialize: () => {
          test.push('bar')
          return false
        },
      })
      .app()
    await app.initialized
    expect(test).toEqual(['bar'])
  })

  it('should have valid Setup type', () => {
    // This should not break on test compilation.
    // TODO: It would be better to have proper type tests.
    interface MySettings {
      my?: {
        foo: string
        bar: number
      }
    }

    interface MyConfig {
      state: {
        test: {
          foo: string
          bar: number
        }
      }
    }

    const setup: Setup<MyConfig, MySettings> = (config, settings) => {
      // Test unwrap
      config.state.test = settings['foo']
    }
    const my = { name: 'my', setup }

    // Use of MySettings
    const config = {
      name: 'foo',
      settings: settings<MySettings>({
        my: {
          foo: 'fox',
          bar: 3,
        },
      }),
      state: {
        test: { foo: 'foo', bar: 2 },
      },
    }
    expect(build(config).using(my).app().state.test).toEqual({
      foo: 'fox',
      bar: 3,
    })
  })
})

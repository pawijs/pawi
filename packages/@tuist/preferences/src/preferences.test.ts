import { Block, build, settings, unproxy } from '@tuist/build'
import { HooksSettings } from '@tuist/hooks'
import { IAction } from 'overmind'
import simple from 'simple-mock'
import { describe, expect, it, restore, sleep } from 'test'
import { deletePrefsDb, preferences, selectPrefsDb } from '.'
import { dbname, DexieDb, getValues, resetDb } from './prefsDb'
import {
  PreferencesHooks,
  PreferencesSettings,
  preferences_clear,
  preferences_restore,
  preferences_save,
} from './types'

const set: IAction<typeof foo, { holder: any; key: string; value: any }> = (
  ctx,
  args
) => {
  const { holder, key, value } = args
  holder[key] = value
}

const push: IAction<typeof foo, { holder: any[]; value: any }> = (
  ctx,
  args
) => {
  const { holder, value } = args
  holder.push(value)
}

const foo = {
  name: 'foo',
  settings: settings<PreferencesSettings & HooksSettings<PreferencesHooks>>({
    hooks: {
      [preferences_restore]: ctx => {
        ctx.state.test.restoreCount += 1
      },
      [preferences_save]: (ctx, { path, value }) => {
        ctx.state.test.saveCount += 1
        ctx.state.test.value[path] =
          typeof value === 'object' ? unproxy(value) : value
      },
    },
    preferences: {
      appName: 'test',
      paths: { 'foo.bar': true, 'foo.baz': true, 'foo.list': true },
      defaults: { 'foo.bar': 'barman' },
      throttle: 100,
    },
  }),
  state: {
    foo: {
      bar: 'bar',
      baz: 'baz',
      list: ['one'],
    },
  },
}

const bar = {
  name: 'bar',
  settings: settings<PreferencesSettings & HooksSettings<PreferencesHooks>>({
    hooks: {
      [preferences_clear]: () => {
        return true
      },
      [preferences_restore]: () => {
        return true
      },
      [preferences_save]: () => {
        return true
      },
    },
    preferences: {
      appName: 'bar',
    },
  }),
}

interface TestConfig {
  state: {
    test: {
      saveCount: number
      restoreCount: number
      value: any
    }
  }
  actions: {
    test: {
      set: typeof set
      push: typeof push
    }
  }
}

const test: Block<TestConfig> = {
  name: 'test',
  state: {
    test: {
      saveCount: 0,
      restoreCount: 0,
      value: {},
    },
  },
  actions: {
    test: {
      set,
      push,
    },
  },
}

const built = build(foo).using(preferences).using(test)

describe('preferences', () => {
  beforeEach(resetDb)
  afterEach(restore)
  it('should parse paths', () => {
    const config = built.config()
    expect(config.state.preferences).toEqual({
      appName: 'test',
      paths: ['foo.bar', 'foo.baz', 'foo.list'],
      defaults: { ['foo.bar']: 'barman' },
      changed: {},
      appWebsite: '/',
    })
  })

  it('should parse last block', async () => {
    const config = build(bar).using(foo).using(preferences).config()
    expect(config.state.preferences).toEqual({
      appName: 'bar',
      appWebsite: '/',
      changed: {},
      defaults: {
        'foo.bar': 'barman',
      },
      paths: ['foo.bar', 'foo.baz', 'foo.list'],
    })
  })

  it('should watch paths', async () => {
    const app = built.app()
    await app.initialized
    expect(app.state.test.restoreCount).toBe(1)

    expect(app.state.preferences.changed).toEqual({})
    app.actions.test.set({ holder: app.state.foo, key: 'bar', value: 'ho' })
    await sleep(10)
    app.actions.test.set({ holder: app.state.foo, key: 'bar', value: 'ha' })
    await sleep(10)
    app.actions.test.set({ holder: app.state.foo, key: 'bar', value: 'hi' })
    await sleep(200)
    expect(app.state.test.value).toEqual({ 'foo.bar': 'hi' })
    expect(app.state.test.saveCount).toBe(1)
  })

  it('should ignore functions', async () => {
    const app = built.app()
    await app.initialized
    expect(app.state.test.restoreCount).toBe(1)

    expect(app.state.preferences.changed).toEqual({})
    app.actions.test.set({
      holder: app.state.foo,
      key: 'bar',
      value: () => 'ho',
    })
    await sleep(200)
    expect(app.state.test.saveCount).toBe(1)
    expect(await getValues()).toEqual([])
  })

  it('should unproxy objects', async () => {
    const app = built.app()
    await app.initialized
    expect(app.state.test.restoreCount).toBe(1)

    expect(app.state.preferences.changed).toEqual({})
    app.actions.test.set({
      holder: app.state.foo,
      key: 'bar',
      value: { ma: 'mo' },
    })
    await sleep(200)
    expect(app.state.test.saveCount).toBe(1)
    expect(await getValues()).toEqual([
      {
        path: 'foo.bar',
        value: { ma: 'mo' },
      },
    ])
  })

  it('should close current db if deleting', async () => {
    const db = await selectPrefsDb('damn', {})
    await db.values.put({ path: 'sugar', value: 'babe' })
    await deletePrefsDb('damn')
    let error: string = ''
    await db.values
      .put({ path: 'sugar', value: 'star' })
      .catch(err => (error = err.message))
    expect(error).toBe(`DatabaseClosedError Database has been closed`)
  })

  it('should not delete inexistant db', async () => {
    await deletePrefsDb('bloom')
    // Should do nothing
  })

  it('should warn on invalid mutation', async () => {
    const errors: string[] = []
    simple.mock(console, 'error').callFn((arg: string) => errors.push(arg))
    const app = built.app()
    await app.initialized
    app.actions.test.push({ holder: app.state.foo.list, value: 'two' })
    await sleep(120)
    expect(errors).toEqual([
      `Method 'push' on path 'foo.list' not supported by preferences.`,
    ])
  })

  it('should restore preferences', async () => {
    const db = new DexieDb(dbname())
    await db.values.put({
      path: 'foo.bar',
      value: 'banana',
    })
    await db.values.put({
      path: 'foo.baz',
      value: 'kiwi',
    })
    await db.values.put({
      path: 'foo.geez.damn',
      value: 'cherry',
    })
    db.close()
    const app = built.app()
    await app.initialized
    expect(app.state.test.restoreCount).toBe(1)
    sleep(120)
    expect(app.state.test.saveCount).toBe(0)

    expect(app.state.foo).toEqual({
      bar: 'banana',
      baz: 'kiwi',
      geez: { damn: 'cherry' },
      list: ['one'],
    })
  })

  it('should clear preferences', async () => {
    let db = new DexieDb(dbname('foo'))
    await db.values.put({
      path: 'foo.bar',
      value: 'banana',
    })
    await db.values.put({
      path: 'foo.boom',
      value: 'kiwi',
    })
    db.close()
    db = new DexieDb(dbname())
    await db.values.put({
      path: 'foo.bar',
      value: 'banana',
    })
    await db.values.put({
      path: 'foo.boom',
      value: 'kiwi',
    })
    db.close()

    const app = built.app()
    await app.initialized
    // Clear default db
    await app.actions.preferences.clear()
    expect(await DexieDb.exists(dbname())).toBe(false)
    // Clear named db
    await app.actions.preferences.clear({ userId: 'foo' })
    expect(await DexieDb.exists(dbname('foo'))).toBe(false)
  })

  it('should not clear if hook halted', async () => {
    const name = 'xoxo'
    const db = new DexieDb(dbname(name))
    await db.values.put({
      path: 'foo.bar',
      value: 'banana',
    })
    await db.values.put({
      path: 'foo.boom',
      value: 'kiwi',
    })
    db.close()
    const app = build(bar).using(preferences).app()
    await app.initialized
    await app.actions.preferences.clear({ userId: name })
    expect(await DexieDb.exists(dbname(name))).toBe(true)
    await selectPrefsDb(name, {})
    expect(await getValues()).toEqual([
      { path: 'foo.bar', value: 'banana' },
      { path: 'foo.boom', value: 'kiwi' },
    ])
  })

  it('should not restore', async () => {
    const name = 'xoxo'
    const db = new DexieDb(dbname(name))
    await db.values.put({
      path: 'foo.bar',
      value: 'banana',
    })
    await db.values.put({
      path: 'foo.boom',
      value: 'kiwi',
    })
    db.close()
    const app = build(bar).using(foo).using(test).using(preferences).app()
    await app.initialized
    expect(app.state.test.restoreCount).toBe(0)
    expect(app.state.foo).toEqual({
      bar: 'bar',
      baz: 'baz',
      list: ['one'],
    })
  })

  it('should not save', async () => {
    const app = build(bar).using(foo).using(test).using(preferences).app()
    await app.initialized
    app.actions.test.set({ holder: app.state.foo, key: 'bar', value: 'hi' })
    await sleep(200)
    expect(app.state.test.saveCount).toBe(0)
  })

  it('should set defaults', async () => {
    const app = built.app()
    await app.initialized
    await app.actions.preferences.selectDb({ userId: 'boom' })
    expect(app.state.foo).toEqual({ bar: 'barman', baz: 'baz', list: ['one'] })
  })
})

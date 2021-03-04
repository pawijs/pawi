import { describe, expect, it, restore } from 'test'

import { build } from '@tuist/build'
import { foo } from '../index.test'
import { locale } from '..'
import simple from 'simple-mock'

describe('set', () => {
  afterEach(restore)
  it('should set locale', async () => {
    const logs: string[] = []
    const warn: string[] = []
    simple.mock(console, 'log').callFn(msg => logs.push(msg))
    simple.mock(console, 'warn').callFn(msg => warn.push(msg))
    const app = build(foo).using(locale).app()
    await app.initialized
    app.actions.locale.set('ru')
    expect(app.state.locale.lang).toBe('ru')
    expect(logs).toEqual([
      `module,key,en,fr\nfoo,foo,"foobar","le fou"`,
      // printMissing
      JSON.stringify({ foo: { foo: 'foobar' } }, null, 2),
    ])
    expect(warn).toEqual([`Missing translations for lang 'ru'`])
    expect(app.state.foo.test).toBe('ru')
  })
})

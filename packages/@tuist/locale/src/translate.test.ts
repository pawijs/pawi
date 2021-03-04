import { Overmind } from 'overmind'
import simple from 'simple-mock'
import { describe, expect, it } from 'test'
import { translate } from './translate'
const locales = {
  fr: {
    foo: 'le fou',
    message: 'Hello {username} !',
    messageNewline: 'Hello\n\nHow are you {username} ?',
  },
}

const config = {
  state: {
    locale: {
      lang: 'fr',
      common: { UserIcon: 'fa-user-o' },
      locales,
      translate,
    },
  },
}
const app = new Overmind(config)
const translateFunc = app.state.locale.translate

describe('translate', () => {
  it('should return a function', () => {
    expect(typeof translateFunc).toBe('function')
  })

  it('should translate common', () => {
    expect(translateFunc('UserIcon')).toBe('fa-user-o')
  })

  it('should translate lang specifics', () => {
    expect(translateFunc('foo')).toBe('le fou')
    expect(translateFunc('message', { username: 'Lily' })).toBe(`Hello Lily !`)
  })

  it('return ugly value in dev', () => {
    const errors: string[] = []
    simple.mock(console, 'error').callFn(msg => errors.push(msg))
    expect(translateFunc('nokey')).toBe('## fr:nokey ##')
    expect(errors).toEqual([`Missing translation for 'nokey' in 'fr'.`])
  })

  it('raise error on missing lang', () => {
    const app = new Overmind({
      state: {
        locale: {
          locales,
          translate,
        },
      },
    })
    expect(() => {
      console.log(app.state.locale.translate)
    }).toThrow('No locale. Make sure locale.lang is set !')
  })

  it('should raise error on missing dictionary', () => {
    const app = new Overmind({
      state: {
        locale: {
          lang: 'es',
          locales,
          translate,
        },
      },
    })
    expect(() => {
      console.log(app.state.locale.translate)
    }).toThrow("Missing dictionary for lang 'es'.")
  })
})

describe('translate in production', () => {
  const config = {
    state: {
      locale: {
        lang: 'fr',
        common: { UserIcon: 'fa-user-o' },
        locales,
        translate,
      },
    },
  }
  const app = new Overmind(config)
  const env = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  const translateFunc = app.state.locale.translate
  process.env.NODE_ENV = env

  it('should return missing key', () => {
    expect(translateFunc('nokey')).toBe('nokey')
  })

  it('should translate', () => {
    expect(translateFunc('foo')).toBe('le fou')
    expect(translateFunc('message', { username: 'Lily' })).toBe(`Hello Lily !`)
    expect(translateFunc('messageNewline', { username: 'Lily' })).toBe(
      `Hello\n\nHow are you Lily ?`
    )
  })
})

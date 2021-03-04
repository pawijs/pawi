import { Overmind } from 'overmind'
import { Provider } from 'overmind-react'
import { createElement } from 'react'
import renderer from 'react-test-renderer'
import simple from 'simple-mock'
import { Config } from './app'

export type Describe = (what: string, callback: () => void) => void

export interface It {
  (should: string, callback: () => void): void
  only: It
}

export interface Matcher {
  toBe(value: any): void
  toBeLessThanOrEqual(value: number): void
  toBeGreaterThanOrEqual(value: number): void
  toEqual(value: any): void
  toMatchObject(value: object): void
  toMatchSnapshot(): void
  toThrow(value: any): void
}

export type FunctionCaller = (fn: () => void) => void
export type Expect = (value: any) => Matcher

declare var describe: any
declare var it: any
declare var expect: any
declare var beforeEach: any
declare var afterEach: any

const _describe = describe as Describe
const _it = it as It
const _expect = expect as Expect
const _beforeEach = beforeEach as FunctionCaller
const _afterEach = afterEach as FunctionCaller

export {
  _describe as describe,
  _it as it,
  _expect as expect,
  _beforeEach as beforeEach,
  _afterEach as afterEach,
}

declare var global: any

export function mockRandomValues() {
  if (global.crypto === undefined) {
    global.crypto = {}
  }
  simple
    .mock(global.crypto, 'getRandomValues')
    .callFn(function (bytes: Uint8Array) {
      for (let i = 0; i < bytes.length; ++i) {
        bytes[i] = i
      }
    })
}

export function restore() {
  simple.restore()
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function testRender(
  app: Overmind<Config> | JSX.Element,
  el?: JSX.Element
) {
  if (app instanceof Overmind) {
    return renderer.create(createElement(Provider, { value: app }, el)).toJSON()
  } else {
    return renderer.create(app).toJSON()
  }
}

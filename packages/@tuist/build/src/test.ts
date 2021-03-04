import simple from 'simple-mock'

export type Describe = (what: string, callback: () => void) => void

export interface It {
  (should: string, callback: () => void): void
  only: It
}

export interface Matcher {
  not: Matcher
  toBe(value: any): void
  toBeLessThanOrEqual(value: number): void
  toBeGreaterThanOrEqual(value: number): void
  toEqual(value: any): void
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

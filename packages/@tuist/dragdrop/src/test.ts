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
  toMatchSnapshot(): void
  toMatch(value: any): void
  not: Matcher
  toThrow(value: any): void
}

export type Expect = (value: any) => Matcher

declare var describe: any
declare var it: any
declare var expect: any

const theDescribe = describe as Describe
const theIt = it as It
const theExpect = expect as Expect

export { theDescribe as describe, theIt as it, theExpect as expect }

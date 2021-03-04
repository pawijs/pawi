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
  toThrow(value: any): void
}

export type Expect = (value: any) => Matcher
export type FunctionCaller = (fn: () => void) => void
export type AfterAll = (fn: () => void) => void

declare var describe: Describe
declare var it: It
declare var expect: Expect
declare var beforeAll: FunctionCaller
declare var afterAll: FunctionCaller

const afterAll_ = afterAll
const beforeAll_ = beforeAll
const describe_ = describe
const expect_ = expect
const it_ = it

export {
  afterAll_ as afterAll,
  beforeAll_ as beforeAll,
  describe_ as describe,
  expect_ as expect,
  it_ as it,
}

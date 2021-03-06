import {
  Composition,
  Element,
  Mutation,
  RangeSelection,
  TYPES,
  TypeName,
  isCaretSelection,
} from './v2/types'
import { ElementType, OperationType, caretSelection } from './lib'
import { rangeSelection, sortAscending } from './v2/helpers'

import { mockable } from './v2/helpers/makeRef'
import simple from 'simple-mock'

export type Describe = {
  (what: string, callback: () => void): void
  only: Describe
}

export interface It {
  (should: string, callback: () => void): void
  only: It
}

export interface Matcher {
  toBe(value: any): void
  toBeLessThanOrEqual(value: number): void
  toBeGreaterThanOrEqual(value: number): void
  toBeUndefined(): void
  toContain(value: any): void
  toEqual(value: any): void
  toMatchSnapshot(): void
  toMatch(re: RegExp): void
  toThrow(value: any): void
}

export type Expect = (value: any) => Matcher
export type FunctionCaller = (fn: () => void) => void

declare var describe: Describe
declare var it: It
declare var expect: Expect
declare var beforeAll: FunctionCaller
declare var afterAll: FunctionCaller
declare var afterEach: FunctionCaller
declare var beforeEach: FunctionCaller

const afterAll_ = afterAll
const afterEach_ = afterEach
const beforeAll_ = beforeAll
const describe_ = describe
const expect_ = expect
const it_ = it
const beforeEach_ = beforeEach

export {
  afterAll_ as afterAll,
  afterEach_ as afterEach,
  beforeEach_ as beforeEach,
  beforeAll_ as beforeAll,
  describe_ as describe,
  expect_ as expect,
  it_ as it,
}

declare var global: any

export function mockRef() {
  let i = 0
  simple.mock(mockable, 'makeId').callFn(() => `ref${++i}`)
}

export function restore() {
  simple.restore()
}

export function elemValue(value: ElementType): string {
  const g = value.g
  return `${value.p}:${value.t}${
    value.o ? ` ${JSON.stringify(value.o)}` : ''
  }: ${
    g
      ? `[${Object.keys(g)
          .map(k => ({ k, elem: g[k] }))
          .sort((a, b) => a.elem.p - b.elem.p)
          .map(({ elem }) => elemValue(elem))
          .join(', ')}]`
      : JSON.stringify(value.i)
  }`
}

function showValue(value: ElementType): string {
  const g = value.g
  return g
    ? `[${Object.keys(g)
        .map(k => ({ k, elem: g[k] }))
        .sort((a, b) => a.elem.p - b.elem.p)
        .map(({ k, elem }) => `${k}: ${showValue(elem)}`)
        .join(', ')}]`
    : `'${value.i}'`
}

function readableOp(op: OperationType): string {
  switch (op.op) {
    case 'select':
      if (op.value.type === 'Caret') {
        return `[${op.value.anchorPath.join('.')}:${op.value.anchorOffset}]`
      } else {
        return `[${op.value.anchorPath.join('.')}:${
          op.value.anchorOffset
        }-${op.value.focusPath.join('.')}:${op.value.focusOffset}]`
      }
    case 'update':
      return `[${op.path.join('.')}] => ${showValue(op.value)}`
    case 'delete':
      return `[${op.path.join('.')}] => ø`
    default:
      return `[${op.op}]`
  }
}

export function expectOps(ops: OperationType[] | undefined): Matcher {
  return expect(ops ? ops.map(readableOp) : undefined)
}

/////////////////////// v2 //////////////////////

function parsei(parentKeys: string[], basepath: string[], str: string) {
  const parts = str.split(/[\|\[\]]/)
  const i = parts.join('')
  const id = firstId(parentKeys, i)
  if (parts.length === 1) {
    // No selection
    return { id, i }
  } else if (parts.length === 3) {
    // Range selection inside i
    return {
      i,
      id,
      s: rangeSelection(
        [...basepath, id],
        parts[0].length,
        [...basepath, id],
        parts[0].length + parts[1].length
      ),
    }
  } else {
    // Single caret
    const caret = str.slice(parts[0].length, parts[0].length + 1)

    if (caret === '[') {
      // Opening range selection inside i
      const s = rangeSelection(
        [...basepath, id],
        parts[0].length,
        ['unknown'],
        0
      )
      return {
        i,
        id,
        s,
        // unfinished selection
        us: s,
      }
    } else if (caret === ']') {
      // Closing range selection
      return {
        i,
        id,
        // finish s
        fs: rangeSelection(['unknown'], 0, [...basepath, id], parts[0].length),
      }
    } else {
      // Caret selection
      return {
        i,
        id,
        s: caretSelection([...basepath, id], parts[0].length),
      }
    }
  }
}

const KEY_RE = /^(([^:{]+):)?([^{]*)(\{.+\}|)$/
export function parseKey(
  parentKeys: string[],
  basepath: string[],
  key: string
) {
  const re = KEY_RE.exec(key)
  const { i, id, s, us, fs } = parsei(parentKeys, basepath, re ? re[3] : key)
  if (re) {
    return {
      i,
      id,
      s,
      us,
      fs,
      json: re[4] && re[4] !== '' ? JSON.parse(re[4]) : undefined,
      type: re[2],
    }
  } else {
    return { id, i, s, us, fs }
  }
}

function setOptions(e: ElementType, type: string) {
  if (!e.o) {
    e.o = {}
  }
  switch (type) {
    case 'ol':
    case 'ul':
      e.o.l = type
      break
    case 'l':
    case 'r':
      e.o.u = type
      break
  }
}

function firstId(seenKeys: string[], base: string) {
  let b = base
  let i = 0
  while (seenKeys.includes(b)) {
    b = `${base}${++i}`
  }
  seenKeys.push(b)
  return b
}

// Yes, interface of this thing is ugly. Could be refactored.
function mapPara(
  mapper: { comp: Composition; us?: RangeSelection; m: string },
  definition: string,
  p: number,
  basepath: string[] = [],
  parentKeys: string[] = []
): { [key: string]: Element } {
  const [key, def] = definition.split('=')
  const { id, i, s, us, fs, json, type } = parseKey(parentKeys, basepath, key)
  if (us) {
    mapper.us = us
  } else if (fs) {
    // finish selection
    if (!mapper.us) {
      console.error(mapper.m)
      throw new Error(`invalid composition definition (ranges do not work)`)
    }
    mapper.us.focusPath = fs.focusPath
    mapper.us.focusOffset = fs.focusOffset
    delete mapper.us
  }
  const t: TypeName = TYPES.includes(type as TypeName)
    ? (type as TypeName)
    : basepath.length
    ? 'T'
    : 'P'
  const seenKeys: string[] = []
  const e: Element = def
    ? {
        t,
        p,
        g: Object.assign(
          {},
          ...def
            .split('.')
            .map((key, p) =>
              mapPara(mapper, key, p, [...basepath, id], seenKeys)
            )
        ),
      }
    : { t, p, i }
  if (s) {
    e.s = s
    mapper.comp.spath = s.anchorPath.join('.')
  }
  if (json) {
    Object.assign(e, json)
  }
  if (type && !TYPES.includes(type as TypeName)) {
    setOptions(e, type)
  }
  return { [id]: e }
}

export function mut(m: string) {
  const comp: Composition = { g: {} }
  const mapper = { comp, m }
  const [cdef, data] = m.split('_')
  const seenKeys: string[] = []
  comp.g = Object.assign(
    {},
    ...cdef.split('/').map((key, p) => mapPara(mapper, key, p, [], seenKeys))
  )
  if (data) {
    comp.data = JSON.parse(data)
  }
  return { comp, sortedIds: Object.keys(comp.g) }
}

const DEFAULTS: { [key: string]: (t: any) => any } = {
  // These are already shown using tum notation
  i: () => undefined,
  g: () => undefined,
  s: () => undefined,
  // Ignore the defaults
  t: (t: string) => (t === 'T' || t === 'P' ? undefined : t),
  // Ignore position (tum renders in p position sorting)
  p: () => undefined,
  // Show all
  o: (o: any) => o,
}

function tumify(
  sh: { path?: string; focus?: number },
  path: string[],
  e: Element
) {
  // console.log(JSON.stringify(e, null, 2), '\n\n\n\n')
  const json: Partial<Element> = {}
  Object.keys(e).forEach(key => {
    const k = key as keyof Element
    const fn = DEFAULTS[k]
    const v = fn ? fn(e[k]) : e[k]
    if (v !== undefined) {
      json[k] = v
    }
  })
  let prefix = json.t || ''
  delete json.t
  const { o } = json
  if (o) {
    if (o.l) {
      prefix = o.l
      delete o.l
    } else if (o.u) {
      prefix = o.u
      delete o.u
    }
    if (!Object.keys(o).length) {
      delete json.o
    }
  }
  const jp = JSON.stringify(json)
  let i = e.i!
  if (e.s) {
    if (isCaretSelection(e.s)) {
      i = i.slice(0, e.s.anchorOffset) + '|' + i.slice(e.s.anchorOffset)
    } else {
      sh.path = e.s.focusPath.join('.')
      sh.focus = e.s.focusOffset
      i = `${i.slice(0, e.s.anchorOffset)}[${
        sh.path === path.join('.')
          ? `${i.slice(e.s.anchorOffset, sh.focus)}]${i.slice(sh.focus)}`
          : i.slice(e.s.anchorOffset)
      }`
    }
  } else if (sh.path && sh.path === path.join('.')) {
    i = i.slice(0, sh.focus) + ']' + i.slice(sh.focus)
    delete sh.path
  }
  return (prefix ? prefix + ':' : '') + i + (jp === '{}' ? '' : jp)
}

export function tum(m: Mutation): string {
  const sh: { path?: string; focus?: number } = {}
  const { comp } = m
  const { data } = comp
  return (
    sortAscending(comp.g)
      .map(id => {
        const e = comp.g[id]
        const { g } = e
        if (g) {
          return `${id}=${sortAscending(g)
            .map(k => tumify(sh, [id, k], g[k]))
            .join('.')}`
        } else {
          return tumify(sh, [id], e)
        }
      })
      .join('/') + (data ? `_${JSON.stringify(data)}` : '')
  )
}

export interface TestDefinition {
  i: string
  o: string
}

export function ensure(op: (m: Mutation) => any, arg: TestDefinition) {
  const m = mut(arg.i)
  // console.log(JSON.stringify(m, null, 2), '\n\n\n\n')
  op(m)
  return expect(tum(m)).toEqual(arg.o)
}

export function makeTest<T = {}>(op: (m: Mutation, arg: T) => void) {
  function test(msg: string, arg: TestDefinition & T) {
    it(msg, () => ensure(m => op(m, arg), arg))
  }
  test.only = (msg: string, arg: TestDefinition & T) =>
    it.only(msg, () => ensure(m => op(m, arg), arg))
  return test
}

import { IS_PROXY, PATH } from 'proxy-state-tree'

export interface Reference<T> {
  _type: T
  _reference: string
}

function checkProxy(arg: any) {
  if (!isProxy(arg)) {
    console.log(typeof arg, arg[IS_PROXY], arg[PATH], arg)
    throw new Error(`Cannot make reference of non-proxy value.`)
  }
}

export function isProxy(arg: any) {
  return typeof arg === 'object' && arg[IS_PROXY]
}

function getAtPath(rootState: any, path: string[]): any {
  let current = rootState
  for (let p of path) {
    if (typeof current !== 'object') {
      return undefined
    }
    current = current[p]
    if (!current) {
      return undefined
    }
  }
  return current
}

export function reference<T>(arg: T): Reference<T> {
  checkProxy(arg)
  const proxy = arg as any
  return { _reference: proxy[PATH] } as Reference<T>
}

export function resolve<T>(
  ctx: { state: any },
  ref: Reference<T> | undefined
): T | undefined {
  if (!ref) {
    return undefined
  }
  return getAtPath(ctx.state, ref._reference.split('.'))
}

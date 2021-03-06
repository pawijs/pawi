export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export const unproxy = deepCopy

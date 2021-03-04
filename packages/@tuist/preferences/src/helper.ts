export function deepSet(base: any, path: string, value: any) {
  if (path === '') {
    console.error(`Invalid path '' for deepSet.`)
    return
  }

  const parts = path.split('.')
  const key = parts.pop() as string
  let current = base
  for (const part of parts) {
    if (current[part] === undefined) {
      current[part] = {}
    }
    const deeper = current[part]
    if (typeof deeper !== 'object') {
      console.error(
        `Cannot deepSet '${path}' (not compatible with base state).`
      )
      return
    }
    current = deeper
  }
  if (value === undefined || value === null) {
    delete current[key]
  } else {
    current[key] = value
  }
}

export function deepGet(base: any, path: string): any {
  if (path === '') {
    console.error(`Invalid path '' for deepGet.`)
    return
  }
  const parts = path.split('.')
  const key = parts.pop() as string
  let current = base
  for (const part of parts) {
    const deeper = current[part]
    if (typeof deeper !== 'object') {
      console.error(
        `Cannot deepGet '${path}' (not compatible with base state).`
      )
      return
    }
    current = deeper
  }
  return current[key]
}

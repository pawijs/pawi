import { CacheFunction } from './types'

export interface Cache {
  cache: CacheFunction
  // Cleanup of unused cache values (anything not called on init run)
  sweep: () => void
  // Call cleanup functions and clear cache
  clear: () => void
  // internal
  store: Map<string, any>
}

export function newCache(): Cache {
  const store = new Map<string, any>()
  const cleaner = new Map<string, (value: any) => void>()
  const touched = new Map<string, boolean>()
  function cache(name: string, fn: () => any, cleanup?: (value: any) => void) {
    touched.set(name, true)
    if (!store.has(name)) {
      store.set(name, fn())
      if (cleanup) {
        cleaner.set(name, cleanup)
      }
    }
    return store.get(name)
  }
  function sweep() {
    for (const k of store.keys()) {
      if (!touched.has(k)) {
        const value = store.get(k)
        store.delete(k)
        if (cleaner.has(k)) {
          cleaner.get(k)!(value)
          cleaner.delete(k)
        }
      }
    }
    touched.clear()
  }
  function clear() {
    for (const k of cleaner.keys()) {
      const value = store.get(k)
      cleaner.get(k)!(value)
    }
    store.clear()
    touched.clear()
    cleaner.clear()
  }
  return { cache, sweep, store, clear }
}

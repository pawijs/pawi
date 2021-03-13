import { WatchLoader, WatchLoaderObserver } from '../types'

import fs from 'fs'
import { simpleLoader } from './simpleLoader.js'

export function watchLoader(): WatchLoader {
  const observers = new Map<WatchLoaderObserver, WatchLoaderObserver>()
  const watched = new Map<string, fs.FSWatcher>()

  function notify(name: string, raw: boolean) {
    for (const entry of observers) {
      const [obs] = entry
      obs.contentChanged(name, raw)
    }
  }

  async function observe(path: string, raw = false) {
    // cache value and read access already done by fsRequire
    if (watched.has(path)) {
      return
    }
    watched.set(
      path,
      fs.watch(path, async () => {
        notify(path, raw)
      })
    )
  }

  const fsLoader = simpleLoader({ observe })

  return {
    ...fsLoader,
    close() {
      fsLoader.close()
      for (const entry of watched) {
        const [, watch] = entry
        watch.close()
      }
      watched.clear()
      observers.clear()
    },
    connect(obs: WatchLoaderObserver) {
      observers.set(obs, obs)
    },
    disconnect(obs: WatchLoaderObserver) {
      observers.delete(obs)
    },
  }
}

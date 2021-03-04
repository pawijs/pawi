import { WatchLoader, WatchLoaderObserver } from '../types'

import { SocketMessage } from './types'
import { simpleLoader } from './simpleLoader.js'

export function watchLoader(): WatchLoader {
  const cache = new Map<string, string>()
  const observers = new Map<WatchLoaderObserver, WatchLoaderObserver>()
  const watched = new Map<string, { path: string; raw: boolean }>()
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const socket = new WebSocket(`${protocol}//${window.location.hostname}`)

  function send(msg: SocketMessage) {
    socket.send(JSON.stringify(msg))
  }

  // Create WebSocket connection.

  // Connection opened
  socket.addEventListener('open', () => {
    for (const entry of watched) {
      send({ type: 'observe', ...entry[1] })
    }
  })

  async function observe(path: string, raw: boolean = false) {
    if (!watched.has(path)) {
      if (socket.readyState === WebSocket.CONNECTING) {
        watched.set(path, { path, raw })
      } else if (socket.readyState === WebSocket.OPEN) {
        send({ type: 'observe', path, raw })
        watched.set(path, { path, raw })
      } else {
        console.error(`Socket closed. Cannot observe '${path}'.`)
      }
    }
  }

  const remoteLoader = simpleLoader({ cache, observe })

  // Listen for messages
  socket.addEventListener('message', event => {
    const msg: SocketMessage = JSON.parse(event.data)
    if (msg.type === 'changed') {
      const { path, raw } = msg
      for (const entry of observers) {
        const [obs] = entry
        obs.contentChanged(path, raw)
      }
    } else {
      console.error(`Invalid message data: ${JSON.stringify(msg)}`)
    }
  })

  return {
    ...remoteLoader,
    close() {
      remoteLoader.close()
      socket.close()
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

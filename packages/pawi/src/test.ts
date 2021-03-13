import { dirname, join } from 'path'
import fs, { promises } from 'fs'

import { SocketMessage } from './loader/remote/types'
import { fileURLToPath } from 'url'
import simple from 'simple-mock'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const basePath = join(__dirname, 'projects')

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export interface Mock {
  opened: () => void
  write: (file: string, content: string) => void
}

class MockEmitter {
  callbacks: {
    [key: string]: ((arg: any) => void)[]
  }
  constructor() {
    this.callbacks = {}
  }

  addEventListener(event: string, cb: (arg: any) => void) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(cb)
  }

  emit(event: string, data?: any) {
    let cbs = this.callbacks[event]
    if (cbs) {
      cbs.forEach(cb => cb({ data }))
    }
  }
}

export function mockFs(): Mock {
  const contents: { [key: string]: string } = {}
  const watchers = new Map<string, () => void>()
  simple.mock(promises, 'access').callFn(function (path: string) {
    if (contents[path]) {
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  })
  simple.mock(promises, 'readFile').callFn(function (path: string) {
    return Promise.resolve(contents[path])
  })
  simple.mock(fs, 'watch').callFn(function (path: string, callback: () => {}) {
    watchers.set(path, callback)
    return {
      close() {
        watchers.delete(path)
      },
    }
  })
  return {
    opened() {},
    write(file: string, content: string) {
      contents[file] = content
      if (watchers.has(file)) {
        watchers.get(file)!()
      }
    },
  }
}

export function mockRemote(): Mock {
  const contents: { [key: string]: string } = {}
  simple.mock(global.window, 'location', {
    protocol: 'http:',
    host: 'localhost',
    pathname: '/',
  })
  const baseLen = `http://localhost/`.length
  let mockSocket: MockSocket | undefined

  class MockSocket extends MockEmitter {
    static CONNECTING = WebSocket.CONNECTING
    static OPEN = WebSocket.OPEN
    static CLOSED = WebSocket.CLOSED
    static CLOSING = WebSocket.CLOSING

    public sent: SocketMessage[] = []
    public observe: { [key: string]: boolean } = {}
    public readyState = MockSocket.CONNECTING

    constructor(public path: string) {
      super()
      mockSocket = this
    }

    // Client API
    send(data: string) {
      // Server handling
      const msg = JSON.parse(data) as SocketMessage
      if (msg.type === 'observe') {
        this.observe[msg.path] = true
      } else {
        throw new Error(`Invalid message: ${data}`)
      }
    }

    // Server API (sending changes to clients)
    changed(path: string) {
      const raw = this.observe[path]
      if (raw !== undefined) {
        const msg: SocketMessage = {
          type: 'changed',
          path,
          raw,
        }
        this.emit('message', JSON.stringify(msg))
      } else {
        console.log(`path '${path}' not observed.`)
      }
    }

    opened() {
      this.readyState = MockSocket.OPEN
      this.emit('open')
    }

    close() {
      this.readyState = MockSocket.CLOSED
      mockSocket = undefined
    }
  }

  simple.mock(global.window, 'fetch').callFn(function (url: string) {
    const content = contents[url.slice(baseLen)]
    return Promise.resolve({
      ok: !!content,
      text() {
        return content
      },
    })
  })
  simple.mock(global.window, 'WebSocket', MockSocket)
  window.WebSocket = MockSocket as any
  return {
    opened() {
      if (mockSocket) {
        mockSocket.opened()
      }
    },
    write(file: string, content: string) {
      contents[file] = content
      if (mockSocket) {
        mockSocket.changed(file)
      }
    },
  }
}

export function restore() {
  simple.restore()
}

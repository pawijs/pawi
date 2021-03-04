import { Mock, mockFs, restore, sleep } from '../../test.js'

import { WatchLoader } from '../types'
import test from 'ava'
import { watchLoader } from './index.js'

let closeWatcher: WatchLoader | undefined
let mock: Mock

test.beforeEach(() => {
  mock = mockFs()
})

test.afterEach(() => {
  restore()
  if (closeWatcher) {
    closeWatcher.close()
    closeWatcher = undefined
  }
})

test('should watch file', async t => {
  mock.write('hello/main.js', 'Hello Tuitui')
  const watcher = (closeWatcher = watchLoader())
  let test = 'not-run'
  watcher.connect({
    contentChanged(name) {
      test = name
    },
  })
  const current = await watcher.loader('hello')('main.js')
  t.is(current, 'Hello Tuitui')
  mock.write('hello/main.js', 'other')
  await sleep(0)
  t.is(test, 'main.js')
})

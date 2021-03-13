import { Mock, mockRemote, restore, sleep } from '../../test.js'

import { WatchLoader } from '../types'
import test from 'ava'
import { watchLoader } from './index.js'

let closeWatcher: WatchLoader | undefined
let mock: Mock
let testval: string = ''

test.beforeEach(() => {
  mock = mockRemote()
  mock.write('hello/main.js', 'Hello Tuitui')
  testval = 'not-run'
})

test.afterEach(() => {
  restore()
  if (closeWatcher) {
    closeWatcher.close()
    closeWatcher = undefined
  }
})

test('should watch file', async t => {
  const watcher = (closeWatcher = watchLoader())
  mock.opened()
  watcher.connect({
    contentChanged(name) {
      testval = name
    },
  })
  const current = await watcher.loader('hello')('main.js')
  t.is(current, 'Hello Tuitui')
  mock.write('hello/main.js', 'other')
  await sleep(0)
  t.is(testval, 'main.js')
})

test('should watch file before open', async t => {
  const watcher = (closeWatcher = watchLoader())
  watcher.connect({
    contentChanged(name) {
      testval = name
    },
  })
  const current = await watcher.loader('hello')('main.js')
  mock.opened()
  t.is(current, 'Hello Tuitui')
  mock.write('hello/main.js', 'other')
  await sleep(0)
  t.is(testval, 'main.js')
})

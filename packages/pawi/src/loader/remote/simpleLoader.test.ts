import { Mock, mockRemote, restore } from '../../test.js'

import { simpleLoader } from './index.js'
import test from 'ava'

let mock: Mock

test.beforeEach(() => {
  mock = mockRemote()
  mock.write('hello/index.js', 'Hello Tuitui')
})

test.afterEach(restore)

test('should return a require function', t => {
  t.is(typeof simpleLoader().loader('hello'), 'function')
})

test('should return file content from name', async t => {
  const load = simpleLoader().loader('hello')
  const value = await load('index.js')
  t.is(value, 'Hello Tuitui')
})

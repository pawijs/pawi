import { Mock, mockFs, restore } from '../../test.js'

import { simpleLoader } from './index.js'
import test from 'ava'

let mock: Mock

test.beforeEach(() => {
  mock = mockFs()
})

test.afterEach(restore)

test('should return a require function', t => {
  t.is(typeof simpleLoader().loader('hello'), 'function')
})

test('should return file content from name', async t => {
  mock.write('hello/index.js', 'Hello Tuitui')
  const load = simpleLoader().loader('hello')
  const value = await load('index.js')
  t.is(value, 'Hello Tuitui')
})

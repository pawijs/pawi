import { expect } from '@esm-bundle/chai'
import { newCache } from './cache'

it('should return same object', () => {
  const { cache } = newCache()
  const obj = cache('obj', () => ({}))
  const other = cache('obj', () => {
    throw new Error('Should not happen')
  })
  expect(obj).to.equal(other)
})

it('should sweep', () => {
  const { store, cache, sweep } = newCache()
  cache('obj1', () => 'obj1')
  cache('obj2', () => 'obj2')
  sweep()
  expect(Array.from(store.keys())).to.deep.equal(['obj1', 'obj2'])
  cache('obj1', () => 'obj1')
  sweep()
  expect(Array.from(store.keys())).to.deep.equal(['obj1'])
})

it('should cleanup on sweep', () => {
  let called = false
  const { cache, sweep } = newCache()
  cache('obj1', () => 'obj1')
  cache(
    'obj2',
    () => 'obj2',
    () => (called = true)
  )
  sweep()
  cache('obj1', () => 'obj1')
  sweep()
  expect(called).to.equal(true)
})

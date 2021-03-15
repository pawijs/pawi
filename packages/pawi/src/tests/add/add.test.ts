import { expect } from '@esm-bundle/chai'
import { loadBranch } from '../../loadBranch'
import { Context } from '../lib/types'

it('renders add', async () => {
  const { value } = await loadBranch<Context>('src/tests/add')
  expect(typeof value.number).to.equal('function')
  expect(value.number!()).to.equal(2021)
})

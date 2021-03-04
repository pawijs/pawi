import { BranchLoader } from './types'
import { Loader } from '../loader/types'
import { childLoader } from './childLoader.js'
import { getBranch } from '../branch/branchLoader.js'

export function branchLoader<T extends {} = {}>(
  loader: Loader
): BranchLoader<T> {
  return async function loadBranch(branchPath, parentContext = {}) {
    const cloader = loader(branchPath)
    const branch = await getBranch(cloader, `index.js`)
    const loadChild = childLoader(cloader, branch)
    return loadChild('main', parentContext)
  }
}

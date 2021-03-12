import { getBranch } from '../branch/getBranch.js'
import { Loader } from '../loader/types'
import { childLoader } from './childLoader.js'
import { BranchLoader } from './types'

export function branchLoader<T extends {} = {}>(
  loader: Loader
): BranchLoader<T> {
  return async function loadBranch(branchPath, parentContext = {}) {
    const cloader = loader(branchPath)
    const branch = await getBranch(cloader, `./branch.o.json`)
    const loadChild = childLoader(cloader, branch)
    return loadChild(branch.entry, parentContext)
  }
}

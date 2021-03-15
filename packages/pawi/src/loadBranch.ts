import { Branch } from '@forten/tree-type'
import { newCache } from './cache'
import { getContext } from './getContext'
import { initBranch } from './initBranch'
import { TChild } from './link.types'
import { makeLoader } from './loader'
const ROOT_BRANCH = './index.o.js'
const PROJECT_ROOT: Branch = {
  type: 'pawi',
  entry: 'root',
  id: 'root',
  version: '1',
  blocks: {
    root: {
      id: 'root',
      name: 'root',
      children: [],
      content: {
        file: ROOT_BRANCH,
      },
    },
  },
}

// This is only used by
/**
 * Used by top-level "run" or "link". For internal
 * sub-branch loading, we load the branch like any
 * other node (with childLoader and caching).
 */
export async function loadBranch<T extends {}>(
  branchPath: string,
  parentContext: Partial<T> = {},
  run = false
): Promise<TChild<T>> {
  // Wrap the branch as a block to enable live reload
  // This branch is only loaded once. No need for sweeping.
  const { cache } = newCache()
  const load = makeLoader(branchPath)
  const { context } = getContext(cache, branchPath, parentContext)
  return initBranch(load, PROJECT_ROOT, context, run)
}

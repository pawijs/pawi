import { Branch } from '@forten/tree-type'
import { childLoader } from './childLoader'
import { Loader, TChild } from './link.types'
import { TContext } from './types'

export async function initBranch<T extends {}>(
  load: Loader,
  branch: Branch,
  context: TContext<T>,
  run = false
): Promise<TChild<T>> {
  // Setup loader for children
  const loadChild = childLoader(context.cache, load, branch)
  // Load branch entry
  return loadChild(branch.entry, context, run)
}

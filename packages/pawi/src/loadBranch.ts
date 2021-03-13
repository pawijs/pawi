import { childLoader } from './childLoader'
import { TChild } from './link.types'
import { simpleLoader } from './simpleLoader'

export async function loadBranch<T extends {}>(
  branchPath: string,
  parentContext: Partial<T> = {}
): Promise<TChild<T>> {
  const load = simpleLoader(branchPath)
  const data = await load(`./branch.o.json`, true)
  const branch = JSON.parse(data)
  const loadChild = childLoader(load, branch)
  return loadChild(branch.entry, parentContext)
}

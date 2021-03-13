import { Loader } from '../loader/types'
import { ProjectLoader } from './types'
import { branchLoader } from './branchLoader.js'
import { updateAll } from './childLoader.js'

export function projectLoader<T>(loader: Loader): ProjectLoader<T> {
  const loadBranch = branchLoader(loader)
  return async function loadProject(projectName, rootCtx = {}) {
    const { updates } = await loadBranch(projectName, rootCtx)
    return updateAll(updates)
  }
}

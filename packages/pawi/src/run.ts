import { loadBranch } from './loadBranch'

export async function run<T>(
  projectPath: string,
  rootCtx: Partial<T> = {}
): Promise<void> {
  await loadBranch(projectPath, rootCtx, true)
}

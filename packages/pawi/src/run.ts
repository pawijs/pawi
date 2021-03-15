import { link } from './link'

export async function run<T>(
  projectPath: string,
  rootCtx: Partial<T> = {}
): Promise<void> {
  return (await link(projectPath, rootCtx))()
}

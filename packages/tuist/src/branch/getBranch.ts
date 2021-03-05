import { Branch } from './types'
import { Load } from '../loader/types'

export async function getBranch(load: Load, name: string): Promise<Branch> {
  const exports = await load(name)
  return exports.branch
}

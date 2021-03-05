import { Load } from '../loader/types'
import { Branch } from './types'

export async function getBranch(load: Load, name: string): Promise<Branch> {
  const data = await load(name, true)
  return JSON.parse(data)
}

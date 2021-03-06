import { ElementsType } from './types'
import { SortDescending } from './getNeighbours'

export function lastId(g: ElementsType): string {
  return SortDescending(g)[0]
}

import { ElementsType } from './types'
import { SortAscending } from './getNeighbours'

export function firstId(g: ElementsType): string {
  return SortAscending(g)[0]
}

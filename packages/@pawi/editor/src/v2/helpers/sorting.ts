import { Elements } from '../types'

export function sortAscending(children: Elements): string[] {
  return Object.keys(children).sort((a, b) => children[a].p - children[b].p)
}

export function sortDescending(children: Elements): string[] {
  return Object.keys(children).sort((a, b) => children[b].p - children[a].p)
}

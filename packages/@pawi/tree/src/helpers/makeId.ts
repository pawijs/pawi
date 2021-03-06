import { nanoid } from 'nanoid'

export function makeId(scope: { [key: string]: any }) {
  let id: string
  do {
    id = nanoid().slice(0, 6)
  } while (scope[id] !== undefined)
  return id
}

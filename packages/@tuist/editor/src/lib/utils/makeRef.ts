import { nanoid } from 'nanoid'
const LEN = 6

export function makeRef() {
  return nanoid(LEN)
}

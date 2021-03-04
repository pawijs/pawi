const CHAR = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const LEN = CHAR.length
const ID_LEN = 6

function rndId(len: number = ID_LEN): string {
  const randBytes = new Uint8Array(len)
  crypto.getRandomValues(randBytes)
  return Array.from(randBytes)
    .map(b => CHAR[b % LEN])
    .join('')
}

export const mockable = { makeId: rndId }

const makeId =
  process.env.NODE_ENV === 'test'
    ? function makeId() {
        return mockable.makeId()
      }
    : mockable.makeId

export function makeRef(group: { [id: string]: any }) {
  while (true) {
    const id = makeId()
    if (group[id] === undefined) {
      return id
    }
  }
}

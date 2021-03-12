import { Arg, Value } from 'src/lib/types'

const PI2 = Math.PI * 2

export function link({ number: v }: Arg): Value {
  if (!v) {
    return
  }
  return {
    number: () => (PI2 * v()) / 24 / 24,
  }
}

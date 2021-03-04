import { Value } from './context'

export function link({ number: x }: Value, { number: y }: Value): Value {
  if (!x || !y) {
    return { number: () => 0 }
  }

  return {
    // This gives the return type
    number: () => x() + y(),
  }
}

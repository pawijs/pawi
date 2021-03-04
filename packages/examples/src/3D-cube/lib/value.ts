import { Value } from './context'

export function update(): Value {
  return {
    number: () => 1,
  }
}

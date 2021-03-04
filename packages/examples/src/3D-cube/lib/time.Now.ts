import { Context, Node } from './context'

export function init({ time }: Context): Node {
  return {
    link: () => ({
      number: () => time.now,
    }),
  }
}

import { Context, Node } from './lib/context'

export function init({ time }: Context): Node {
  return {
    link: () => ({
      number: () => time.now * 0.1,
    }),
  }
}

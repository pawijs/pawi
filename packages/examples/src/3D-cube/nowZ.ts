import { Context, Block } from '../lib/types'

export async function init({ time }: Context): Block {
  return {
    link: () => ({
      number: () => time.now * 0.1,
    }),
  }
}

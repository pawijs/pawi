import { Context, Block } from 'src/lib/types'

export async function init({ time }: Context): Block {
  return {
    link: () => ({
      number: () => time.now * 0.3,
    }),
  }
}

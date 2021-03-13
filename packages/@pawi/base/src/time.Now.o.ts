import { Block, Context } from './types'

export async function init({ time }: Context): Block {
  return {
    link: () => ({
      number: () => time.now,
    }),
  }
}

import { Block, Context } from 'pawi.types'

export async function init({ time }: Context): Block {
  return {
    link: () => ({
      number: () => time.now,
    }),
  }
}

import { Block, Context } from 'pawi.types'

export async function init({}: Context): Block {
  return {
    link: () => ({
      number: () => 0,
    }),
  }
}

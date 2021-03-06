import { Block, Context } from 'pawi.types'

export async function init({ midi }: Context): Block {
  if (!midi) {
    return {}
  }
  return {
    link: () => ({
      number: () => midi.songPosition,
    }),
  }
}

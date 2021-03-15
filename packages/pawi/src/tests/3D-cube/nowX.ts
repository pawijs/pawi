import { Block, Context } from '../lib/types'

export async function init({ time, cache }: Context): Block {
  // This is a solution to create smooth "continuous" values on
  // code reload without jumps that would happen with scaling the
  // timeline (`time.now * [value]`).
  //
  // This is a good solution for live-coding as a show in itself but
  // it is bad when creating a project because the state of the
  // app is not a function of time anymore.
  const stepper = cache('stepper', () => ({ value: 2 }))
  return {
    link: () => ({
      number: () => {
        stepper.value += time.dt * 0.5 // <=== change this value
        return stepper.value
      },
    }),
  }
}

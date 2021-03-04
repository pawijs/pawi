import { ClearSelection, MutateHook } from '../../types'

export const closeOptions: MutateHook<ClearSelection> = (_, arg) => {
  const { elem } = arg
  if (elem.o?.open) {
    delete elem.o.open
    if (Object.keys(elem.o).length === 0) {
      delete elem.o
    }
  }
}

import { DeleteParagraph, MutateHook } from '../../types'

export const removeData: MutateHook<DeleteParagraph> = (mut, arg) => {
  const { elem, path } = arg
  if (elem.c) {
    const { comp } = mut
    const { data } = comp
    if (!data) {
      return
    }
    const id = path[0]
    const d = data[id]
    if (!d) {
      return
    }
    delete data[id]
  }
}

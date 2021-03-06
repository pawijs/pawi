import { siblings } from '../../helpers'
import { DeleteParagraph, MutateHook, Mutation } from '../../types'

function deleteU({ comp, sortedIds }: Mutation, id: string, direction: number) {
  const pos = sortedIds.indexOf(id)
  for (let p = pos + direction; p > 0; p += direction) {
    const e = comp.g[sortedIds[p]]
    if (e && e.o?.u) {
      delete e.o.u
      delete e.o.uw
      if (!Object.keys(e.o).length) {
        delete e.o
      }
    } else {
      return
    }
  }
}

export const removeColumns: MutateHook<DeleteParagraph> = (m, arg) => {
  const { elem, path } = arg
  const id = path[0]
  const u = elem.o?.u
  if (u === 'r') {
    // Element was part of right column.
    const [, n] = siblings(m.comp, [], id, m.sortedIds)
    if (!n || n.elem.o?.u !== u) {
      // Removing last element in column => clear column setting.
      deleteU(m, id, -1)
    }
  }
}

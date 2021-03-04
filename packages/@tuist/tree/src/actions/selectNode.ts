import { Action } from '../app'
import { TreeType } from '../types'

export interface SelectNodeArg {
  id: string
  editName: boolean
  tree: TreeType
}

export const selectNode: Action<SelectNodeArg> = (ctx, arg) => {
  const { editName, id, tree } = arg
  const { selected } = tree
  if (selected && selected.id === id && selected.editName === editName) {
    delete tree.selected
  } else {
    tree.selected = { id, editName }
  }
}

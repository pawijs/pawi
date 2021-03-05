import { TreeType } from 'tuist'
import { Action } from '../app'

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
  const definition = ctx.state.tree.definitions()[tree.type]
  if (definition) {
    definition.selectNode.forEach(fun => fun(ctx, arg))
  }
}

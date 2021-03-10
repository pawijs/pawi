import { TreeType } from '@forten/tree-type'
import { Message } from '../../message.types'
import * as actions from './actions'
export * from '../../message.types'

export type BranchContent = { file: string }
export type TreeData = TreeType<BranchContent>

export interface TreeEditorConfig {
  actions: {
    pawi: typeof actions
  }
  state: {
    treeEditor: {
      tree?: TreeData
      // Path of loaded tree
      path: string
      // Dirname of loaded tree
      dirname: string
      // Avoid blink on load
      loading: boolean
      showLibrary: boolean
      send: (message: Message) => void
    }
  }
}

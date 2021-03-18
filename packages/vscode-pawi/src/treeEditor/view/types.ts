import { TreeType } from '@forten/tree-type'
import { EditorToVSCodeMessage } from '../../message.types'
import * as actions from './actions'
import * as receive from './receive'
export * from '../../message.types'

export type BranchContent = { file: string }
export type TreeData = TreeType<BranchContent>

export interface TreeEditorConfig {
  actions: {
    treeEditor: typeof actions
    receive: typeof receive
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
      send: (message: EditorToVSCodeMessage) => void
    }
  }
}

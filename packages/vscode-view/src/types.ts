import { TreeType } from '@forten/tree-type'
import * as actions from './actions'
import { Message } from './message.types'
export * from './message.types'

export type BranchContent = { file: string }
export type TreeData = TreeType<BranchContent>

export interface PawiConfig {
  actions: {
    pawi: typeof actions
  }
  state: {
    pawi: {
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

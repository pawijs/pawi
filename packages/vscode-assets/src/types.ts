import { CompositionHolder } from '@tuist/editor'
import { TreeType } from '@tuist/tree'
import * as actions from './actions'

export type BranchContent = { file: string }
export type TreeData = TreeType<BranchContent>

export interface TuistConfig {
  actions: {
    tuist: typeof actions
  }
  state: {
    tuist: {
      tree: TreeData
      doc: CompositionHolder
    }
  }
}

import { TreeType } from '@tuist/tree'
import * as actions from './actions'

export type BranchContent = { file: string }
export type TreeData = TreeType<BranchContent>
export interface ReadyMessage {
  type: 'ready'
}

export interface UpdateMessage {
  type: 'update'
  text: string
}

export interface SelectMessage {
  type: 'select'
  path: string
}

export type Message = ReadyMessage | UpdateMessage | SelectMessage

export interface TuistConfig {
  actions: {
    tuist: typeof actions
  }
  state: {
    tuist: {
      tree?: TreeData
      send: (message: Message) => void
    }
  }
}

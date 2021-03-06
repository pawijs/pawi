import { TreeType } from 'pawi'
import * as actions from './actions'

export type BranchContent = { file: string }
export type TreeData = TreeType<BranchContent>
export interface ReadyMessage {
  type: 'ready'
}

export interface UpdateMessage {
  type: 'update'
  // Path of branch file (to get relative path on
  // file drop).
  path: string
  text: string
}

export interface SelectMessage {
  type: 'select'
  path: string
}

export interface LibraryMessage {
  type: 'library'
  paths: string[]
}

export type Message =
  | ReadyMessage
  | UpdateMessage
  | SelectMessage
  | LibraryMessage

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

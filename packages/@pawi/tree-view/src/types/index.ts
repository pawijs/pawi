export * from './ComponentType'
export * from './DragDrop'
export * from './GetTextSizeType'
export * from './UILayoutType'
export * from './UINodeType'
export * from './UITreeType'

import { TreeType } from 'pawi'
import * as actions from '../actions'
import { DropTargetInfoById } from './DragDrop'
import { UITreeType } from './UITreeType'

export interface SlotInfo {
  x: number
  y: number
  nodeId: string
  slotIdx: number
}

export interface TreeViewConfig {
  state: {
    treeView: {
      dropTarget: DropTargetInfoById
      libraryTree?: TreeType
      library: { name: string; content: any }[]
      // Cached uimap
      uimap: {
        [key: string]: UITreeType
      }
    }
  }

  actions: {
    treeView: typeof actions
  }
}

export * from './ComponentType'
export * from './DragDrop'
export * from './GetTextSizeType'
export * from './UITreeType'
export * from './UILayoutType'
export * from './UINodeType'

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

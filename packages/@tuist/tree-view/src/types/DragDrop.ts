import { Reference } from '@tuist/build'
import { TreeType } from 'tuist'

export interface TreeDrag {
  // A reference to the original graph where the drag operation started.
  origin: Reference<TreeType>
  // The dragged branch (sub-graph)
  tree: TreeType
  nodeId: string
}

export interface LibraryDrag {
  block: {
    name: string
    content: any
  }
}

export interface TreeDrop {
  // The tree on which to drop.
  target: Reference<TreeType>
}

export interface DropTargetInfo {
  nodeId: string
  slotIdx: number
}

export interface DropTargetInfoById {
  [key: string]: DropTargetInfo
}

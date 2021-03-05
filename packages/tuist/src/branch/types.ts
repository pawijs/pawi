import { Loader } from '../loader/types'

export interface BlockDefinition<T = any> {
  id: string
  children: (string | null)[]
  name: string
  content: T

  // ** UI stuff **
  // This is used to know how many slots have to be drawn
  // If set to 'undefined', will add new slots.
  childrenCount?: number
  closed?: boolean
  // Context errors ? This does not show in UI...
  // cerr?: string[]
  // When a block is invalid, it is not initialized nor updated.
  invalid?: boolean
  // Slot connection errors (renders block invalid)
  serr?: (string | null)[]
}

export interface BranchDefinition<T = any> {
  // Unique identifier for this branch.
  id: string
  // Type of tree. Only same types can drag/drop on each other
  type: string
  // Version changes on each edits to make sure cached uimap is in sync
  version: string
  // Id of root element for this branch. Without a root, this is
  // a detached branch.
  root?: string
  // On drag operation, keep sizes to avoid tree shaking
  lock?: { parentId: string; slotIdx: number; width: number }
  // To open an edit view or other usage (select node)
  selected?: { id: string; editName: boolean }

  entry: string
  blocks: {
    [key: string]: BlockDefinition<T>
  }
}

export type TreeType<T = any> = BranchDefinition<T>

export type Source = BlockDefinition<{ file: string }>

export type Branch = BranchDefinition<{ file: string }>

export interface LoadBranchOptions {
  loader: Loader
}

export interface LoadBranch {
  (name: string): Promise<Branch>
}

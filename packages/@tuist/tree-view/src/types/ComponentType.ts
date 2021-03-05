import { TreeType } from 'tuist'

// A scene, a project or what we store in the library.
// Nothing to do with 'Component' used in ui.
export interface ComponentType {
  _id: string
  _rev?: string
  _deleted?: boolean
  // 'scene' or 'component' or 'project'
  type: string
  name: string
  graph: TreeType
  // selected block in graph
  blockId?: string
  // list of scene ids (for project)
  scenes?: string[]
}

export interface ComponentByIdType {
  [key: string]: ComponentType
}

import * as actions from '../actions'
import { AddArg } from '../actions'
import { TreeType } from './TreeType'

export * from './TreeType'

export interface TreeConnectArg {
  nodeId: string
  slotIdx: number
  tree: TreeType
}

export interface TreeChangedHook {
  (
    ctx: { state: any },
    arg: { tree: TreeType; connecting?: TreeConnectArg }
  ): void
}

export interface TreeContentChangedHook<T> {
  (
    ctx: { state: any },
    arg: { tree: TreeType; nodeId: string; previousContent: T }
  ): void
}

export interface NewBlockHook<T> {
  (ctx: { state: any }, arg: AddArg): { name: string; content: T }
}

export interface TreeHooks<T = any> {
  [type: string]: {
    // The definition of the last block is used.
    newBlock: NewBlockHook<T>
    // Executed in block loading order.
    treeChanged: TreeChangedHook[]
    contentChanged: TreeContentChangedHook<T>[]
    contentComponent: any
  }
}

export interface TreeDefinitions<T = any> {
  [type: string]: {
    newBlock?: NewBlockHook<T>
    treeChanged?: TreeChangedHook
    contentChanged?: TreeContentChangedHook<T>
    contentComponent?: any
  }
}

export interface TreeSettings<T = any> {
  // Tree components where we show the rest of the app.
  tree?: TreeDefinitions<T>
}

export interface TreeConfig {
  state: {
    tree: {
      definitions: () => TreeHooks
    }
  }

  actions: {
    tree: typeof actions
  }
}

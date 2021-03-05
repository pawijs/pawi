import { Loader } from '../loader/types'

export interface Source {
  id: string
  name: string
  content: {
    file: string
  }
  children: string[]
}
export type NodeInfo = Source

export interface Branch {
  type: string
  id: string
  version: string
  entry: string
  blocks: {
    [key: string]: NodeInfo
  }
}

export interface LoadBranchOptions {
  loader: Loader
}

export interface LoadBranch {
  (name: string): Promise<Branch>
}

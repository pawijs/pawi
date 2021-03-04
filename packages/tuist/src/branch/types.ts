import { Loader } from '../loader/types'

export interface Source {
  // This serves as branch identification: must be unique in project
  file: string
  children?: string[]
}
export type NodeInfo = Source

export interface Branch {
  [key: string]: NodeInfo
  main: Source
}

export interface LoadBranchOptions {
  loader: Loader
}

export interface LoadBranch {
  (name: string): Promise<Branch>
}

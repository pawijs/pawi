import { TChild, Update } from '../types'

import { Branch } from '../branch/types'
import { Loader } from '../loader/types'

export interface LinkerOptions {
  loader: Loader
}

export interface ChildLoaderOptions {
  loader: Loader
  projectName: string
  branch: Branch
}

export interface ChildLoader<T extends {} = {}> {
  (id: string, context?: Partial<T>): Promise<TChild<T>>
}

export interface BranchLoader<T extends {} = {}> {
  (id: string, context?: Partial<T>): Promise<TChild<T>>
}

export interface ProjectLoader<T> {
  (path: string, context?: Partial<T>): Promise<Update>
}

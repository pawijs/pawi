import { Branch } from '@forten/tree-type'
import { TArg, Update } from './types'

export interface TChild<C extends Object> {
  value: TArg<C>
  updates: Update[]
}

export interface Loader<T = any> {
  (name: string, raw?: boolean): Promise<T>
}

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

export interface LoadBranchOptions {
  loader: Loader
}

export interface LoadBranch {
  (name: string): Promise<Branch>
}

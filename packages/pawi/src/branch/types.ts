import { Branch } from '@forten/tree-type'
import { Loader } from '../loader/types'

export interface LoadBranchOptions {
  loader: Loader
}

export interface LoadBranch {
  (name: string): Promise<Branch>
}

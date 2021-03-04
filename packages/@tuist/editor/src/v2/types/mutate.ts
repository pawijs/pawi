import { Composition } from './composition'
import { Element } from './element'

export interface Mutation {
  comp: Composition
  sortedIds: string[]
}

export interface MutateHook<T = HookArg> {
  (mutation: Mutation, arg: T): void
}

export interface DeleteParagraph {
  type: 'deleteParagraph'
  path: string[]
  elem: Element
}

export interface ClearSelection {
  type: 'clearSelection'
  path: string[]
  elem: Element
}

export type HookArg = DeleteParagraph | ClearSelection

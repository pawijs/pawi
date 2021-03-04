import { Action, Operator } from '../app'
import {
  CompositionHolder,
  CompositionWrapper,
  ElementSize,
  ElementSizes,
} from '../lib/utils/types'
import { debounce, mutate, pipe, run } from 'overmind'

export interface SizeChangeArgs {
  holder: CompositionHolder
  key: string
  size: ElementSize
}

const BATCH_MS = 20

const batchChanges: { [itemId: string]: ElementSizes } = {}

export const batchSizeChange: Operator<SizeChangeArgs> = run((_, value) => {
  const { holder, key, size } = value
  const { composition } = holder as CompositionWrapper
  let batch: ElementSizes
  if (batchChanges[holder.id!]) {
    batch = batchChanges[holder.id!]
  } else {
    batch = JSON.parse(JSON.stringify(composition.sz || {}))
    batchChanges[holder.id!] = batch
  }
  batch[key] = size
})

export const flushBatch: Operator<SizeChangeArgs> = mutate((_, value) => {
  const { holder } = value
  const { composition } = holder as CompositionWrapper

  const batch = batchChanges[holder.id!]
  if (batch) {
    Object.assign(composition.sz, batch)
    delete batchChanges[holder.id!]
  }
})

export const sizeChange: Action<SizeChangeArgs> = pipe(
  mutate(({ effects: { editor } }, value) => {
    const { holder } = value
    const composition = editor.ensureComposition(holder)
    // @ts-ignore (Legacy size format)
    if (composition.sizes) {
      // @ts-ignore
      delete composition.sizes
    }
    if (!composition.sz) {
      composition.sz = {}
    }
  }),
  batchSizeChange,
  debounce(BATCH_MS),
  flushBatch
)

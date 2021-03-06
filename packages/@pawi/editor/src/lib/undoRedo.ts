import { CompositionHolder } from '.'
import { Context } from '../app'
import { PATH } from 'proxy-state-tree'
import { UndoStore } from '../types'
const UNDO_SIZE = 30

function checkPath(store: UndoStore, holder: CompositionHolder) {
  const path: string = (holder as any)[PATH]
  if (path !== store.path) {
    // clear storage
    store.path = path
    store.idx = 0
    store.store = []
  }
}

export function undoRedo(
  ctx: Context,
  holder: CompositionHolder,
  delta: number
) {
  const { store } = ctx.state.editor
  checkPath(store, holder)
  store.idx = (store.idx + UNDO_SIZE + delta) % UNDO_SIZE
  const payload = store.store[store.idx]
  if (!payload) {
    // ignore
    return
  }
  holder.composition = JSON.parse(payload)
}

export function store(
  ctx: { state: { editor: { store: UndoStore } } },
  holder: CompositionHolder
) {
  const { store } = ctx.state.editor
  checkPath(store, holder)
  const { composition } = holder
  if (!composition) {
    return
  }
  store.idx = (store.idx + 1) % UNDO_SIZE
  store.store[store.idx] = JSON.stringify(composition)
}

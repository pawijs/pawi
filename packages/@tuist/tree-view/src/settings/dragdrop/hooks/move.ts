import { DragdropHooks, Position } from '@tuist/dragdrop'
import { Reference, resolve } from '@tuist/build'
import { SlotInfo, TreeDrag, TreeDrop } from '../../../types'

import { Context } from '../../../app'
import { TreeType } from '@tuist/tree'
import { defaultUILayout } from '../../../helpers'

const MIN_TREE_DIST = Math.pow(200, 2)

interface GraphPosition {
  tree: Reference<TreeType>
  id: string
  x: number
  y: number
  width: number
  height: number
  slots: SlotInfo[]
}

interface PositionWithSize extends Position {
  width?: number
  height?: number
}

function findClosest<T extends PositionWithSize>(
  elements: T[],
  position: Position,
  minDistance: number = Infinity,
  useSize: boolean = false
): T | undefined {
  const { x, y } = position
  // Find closest slot.
  let d = minDistance
  let target: T | undefined = undefined
  for (const e of elements) {
    let dx = e.x - x
    let dy = e.y - y
    if (useSize) {
      const { width, height } = e
      if (dx < 0 && width) {
        dx = Math.min(
          // distance to left border
          -dx,
          // distance to right border
          Math.abs(dx + width)
        )
      }
      if (dy < 0 && height) {
        dy = Math.min(
          // distance to top border
          -dy,
          // distance to bottom border
          Math.abs(dy + height)
        )
      }
    }
    const distance = dx * dx + dy * dy
    if (distance < d) {
      d = distance
      target = e
    }
  }
  return target
}

export const move: DragdropHooks['move'] = (ctx: Context, value) => {
  const { state } = ctx
  const { position } = value
  const { drag } = state.dragdrop
  if (!drag) {
    return false
  }
  const anchor = drag.anchor
  const { SLOT, SPAD, RADIUS } = defaultUILayout
  const slotPosition = {
    x: position.x - anchor.x + 0.5 + RADIUS + SPAD + SLOT,
    y: position.y - anchor.y + 0.5,
  }

  const { tree: branch } = drag.payload as TreeDrag
  const trees: GraphPosition[] = Array.from(
    document.getElementsByClassName(`tree-${branch.type}`)
  )
    .map(e => {
      const uigraph = ctx.state.treeView.uimap[e.id]
      if (!uigraph || !uigraph.tree) {
        return undefined
      }
      const rect = e.getBoundingClientRect() as DOMRect
      const g: GraphPosition = {
        tree: uigraph.tree,
        id: e.id,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        slots: uigraph.slots,
      }
      return g
    })
    .filter(e => e) as GraphPosition[]

  // clear other target
  const { dropTarget } = state.treeView
  const oldId = Object.keys(dropTarget)[0]

  // find closest graph on page
  const tree = findClosest(trees, slotPosition, MIN_TREE_DIST, true)
  if (tree) {
    const slot = findClosest(tree.slots, {
      x: slotPosition.x - tree.x,
      y: slotPosition.y - tree.y,
    })
    if (slot) {
      if (oldId === tree.id) {
        const oldSlot = dropTarget[oldId]
        if (
          oldSlot.nodeId === slot.nodeId &&
          oldSlot.slotIdx === slot.slotIdx
        ) {
          // did not change
          return true
        }
      } else {
        delete dropTarget[oldId]
      }
      dropTarget[tree.id] = JSON.parse(JSON.stringify(slot))
      const payload: TreeDrop = {
        target: tree.tree,
      }
      state.dragdrop.drop = {
        type: 'tree',
        callback: () => ctx.actions.treeView.drop,
        payload,
      }
      const definition = state.tree.definitions()[branch.type]
      const target = resolve(ctx, tree.tree)
      if (definition && target) {
        ctx.actions.tree.changed({
          tree: target,
          connecting: {
            nodeId: slot.nodeId,
            slotIdx: slot.slotIdx,
            tree: branch,
          },
        })
      }
      return true
    } else {
      // no drop
      delete state.dragdrop.drop
      delete dropTarget[oldId]
    }
  } else {
    delete state.dragdrop.drop
    delete dropTarget[oldId]
  }
  return false
}

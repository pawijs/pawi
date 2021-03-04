import { BlockDefinition, StringMap, TreeType } from '@tuist/tree'
import {
  UILayoutType,
  UINodeType,
  UIPosType,
  UISlotType,
  UITreeType,
} from '../types'

import { PALETTE_COUNT } from './colors'
import { defaultUILayout } from './uilayout'
import { minSize } from './minSize'
// @ts-ignore
import stringhash from 'string-hash'

/** Compute svg path of a box with up and down slots.
 * The sizes have to be computed first in the 'info' field.
 */
function path(boxdef: UINodeType, layout: UILayoutType) {
  const { size, sextra } = boxdef
  const { us, ds, w, wd, wde, wu, h } = size
  const r = layout.RADIUS

  // path starts at top-left corner + RADIUS in x direction.
  // top-left is (0,0) because we translate with a <g> tag.
  const res = [`M${r} 0`]

  for (let i = 0; i < us; i += 1) {
    res.push(`h${layout.SPAD}`)
    res.push(`l${layout.SLOT} ${-layout.SLOT}`)
    res.push(`l${layout.SLOT} ${layout.SLOT}`)
  }

  // SPAD   /\  SPAD  /\
  // +-----+  +------+  +-----------+
  // |--------- wu ----------|
  // |--------- w  -----------------|
  const rpadu = w - wu
  if (rpadu > 0) {
    res.push(`h${rpadu + layout.SPAD}`)
  } else {
    res.push(`h${layout.SPAD}`)
  }

  res.push(`a${r} ${r} 0 0 1 ${r} ${r}`)

  res.push(`v${h - 2 * r}`)

  res.push(`a${r} ${r} 0 0 1 ${-r} ${r}`)

  const rpadd = w - wd - wde + (sextra[ds] || 0)
  if (rpadd > 0) {
    res.push(`h${-rpadd - layout.SPAD}`)
  } else {
    // ??
    // console.log ( 'ERROR', w )
    res.push(`h${-layout.SPAD}`)
  }

  for (let i = ds - 1; i >= 0; i -= 1) {
    res.push(`l${-layout.SLOT} ${-layout.SLOT}`)
    res.push(`l${-layout.SLOT} ${layout.SLOT}`)
    res.push(`h${-layout.SPAD - (sextra[i] || 0)}`)
  }

  res.push(`a${r} ${r} 0 0 1 ${-r} ${-r}`)

  res.push(`v${-h + 2 * r}`)
  res.push(`a${r} ${r} 0 0 1 ${r} ${-r}`)

  return res.join(' ')
}

function invalidPath(boxdef: UINodeType, layout: UILayoutType) {
  const { size } = boxdef
  const { h } = size
  const r = layout.RADIUS
  const width = Math.ceil((layout.SPAD * 2) / 3)

  // path starts at top-left corner + RADIUS in x direction.
  // top-left is (0,0) because we translate with a <g> tag.
  const res = [`M${r} 0`]
  res.push(`h${width} v${h} h${-width}`)
  res.push(`a${r} ${r} 0 0 1 ${-r} ${-r}`)
  res.push(`v${-h + 2 * r}`)
  res.push(`a${r} ${r} 0 0 1 ${r} ${-r}`)
  return res.join(' ')
}

export function className(objName: string) {
  const name = objName.split('.')[0]
  let num = 9 + stringhash(name)
  return `box${1 + (num % PALETTE_COUNT)}`
}

/** Compute box position.
 */
function boxPosition(
  graph: TreeType,
  blockId: string,
  flags: StringMap<BlockDefinition> | undefined,
  layout: UILayoutType,
  uigraph: UITreeType,
  ctx: UIPosType
): number {
  const block = graph.blocks[blockId]

  // store our position given by ctx
  const uinode = uigraph.uiNodeById[blockId]
  uinode.pos = ctx
  // set slot information in global tree
  uinode.slots.forEach(slot => {
    uigraph.slots.push({
      x: slot.pos.x + ctx.x,
      y: slot.pos.y + ctx.y,
      nodeId: blockId,
      slotIdx: slot.idx,
    })
  })

  const dy = layout.HEIGHT + layout.VPAD

  let x = ctx.x

  const ds = uinode.size.ds

  // const sextra = uinode.sextra

  // get children
  let cheight = 0
  if (block.closed) {
    // do nothing
  } else {
    const children = block.children
    const lock =
      graph.lock && graph.lock.parentId === block.id ? graph.lock : undefined
    for (let i = 0; i < ds; ++i) {
      if (lock && i == lock.slotIdx) {
        x += lock.width
      } else {
        const childId = children[i]

        if (childId) {
          const h = boxPosition(graph, childId, flags, layout, uigraph, {
            x,
            y: ctx.y + dy,
          })
          cheight = Math.max(cheight, h)
          x += layout.BPAD + uigraph.uiNodeById[childId].size.w
        } else if (childId === null) {
          // empty slot, add slot padding
          x += layout.SPAD + 2 * layout.SLOT
        }
      }
    }
  }

  return dy + cheight
}

const uimapOne = (
  graph: TreeType,
  blockId: string,
  flags: StringMap<BlockDefinition> | undefined,
  layout: UILayoutType,
  uigraph: UITreeType,
  slotIdx: number,
  parent: string | undefined
) => {
  const block = graph.blocks[blockId]
  uigraph.uiNodeById[blockId] = {
    id: blockId,
    slotIdx,
    parent,
    closed: block.closed,
  } as UINodeType

  const uibox = uigraph.uiNodeById[blockId]

  const isRoot = block.id === graph.root

  uibox.name = block.name

  if (isRoot) {
    uibox.className = 'main'
  } else {
    uibox.className = className(block.name)
  }

  const lock =
    graph.lock && graph.lock.parentId === blockId ? graph.lock : undefined

  const size = minSize(block, layout, isRoot, lock)

  size.wde = 0

  const { childrenCount } = block
  const slots: UISlotType[] = []
  const sl = layout.SLOT

  const sextra = [0] // extra spacing before slots
  // first has 0 extra spacing
  // second has spacing dependent on first child, etc
  const ds = size.ds

  const flagBlock = flags ? flags[blockId] : block

  if (ds > 0) {
    let x = layout.RADIUS + layout.SPAD
    const y = layout.HEIGHT

    const sline = layout.sline
    const spath = layout.spath
    const plus = layout.plus
    const click = layout.click

    const slotpad = layout.SPAD + 2 * layout.SLOT

    const serr = flagBlock.serr
    for (let i = 0; i < ds; i += 1) {
      const childId = block.children[i]
      const pos = { x: x + sl, y }
      const free = !childId
      const incompatible = !!(serr && serr[i])

      // TODO: could we use slot error 'serr' here ?
      if (childrenCount !== undefined && i >= childrenCount) {
        // extra links outside of inputs...
        slots.push({
          path: sline,
          idx: i,
          pos,
          plus,
          click,
          flags: { detached: true },
        })
      } else if (incompatible) {
        slots.push({
          path: sline,
          idx: i,
          pos,
          plus,
          click,
          flags: { free, incompatible },
        })
      } else {
        slots.push({
          path: spath,
          idx: i,
          pos,
          plus,
          click,
          flags: { free },
        })
      }

      if (block.closed) {
        // should not draw slot
      } else {
        if (childId || (lock && lock.slotIdx === i)) {
          // const nodes = uigraph.nodes

          // We push in sextra the delta for slot i
          let w = childId
            ? uimapOne(graph, childId, flags, layout, uigraph, i, blockId)
            : lock!.width
          // w contains slotpad

          if (size.hasExtra && i === ds - 2) {
            if (x + w + slotpad < size.w) {
              // Do not change w: we have enough space
              // OK
            } else if (size.w > w && x + 2 * slotpad < size.w) {
              w = size.w - 2 * slotpad
            } else {
              // computing space for last element
              // 1. No need for padding before.
              // 2. Move back on element below.
              w += -2 * slotpad
            }
          } else if (i === ds - 1) {
            // No extra space for after last element
            w += -slotpad
          }

          w = Math.max(slotpad, w)
          sextra.push(w - slotpad)
          x += w
        } else {
          // empty slot
          sextra.push(0)
          x += slotpad
        }
      }
    }

    // Compute extra size for this box depending on i-1 children ( last child
    // does not change slot position )
    if (sextra.length > 0) {
      size.wde = sextra.reduce((sum, e) => sum + e)
    }

    size.w = Math.max(size.w, size.wd + size.wde)
  }

  uibox.invalid = flagBlock.invalid
  uibox.sextra = sextra

  uibox.size = size

  uibox.path = path(uibox, layout)
  if (block.invalid) {
    uibox.invalidPath = invalidPath(uibox, layout)
  }
  uibox.arrow = block.closed ? layout.ARROW_CLOSED : layout.ARROW_OPEN
  uibox.slots = slots
  // draw nodes from child to parent
  uigraph.nodes.push(blockId)
  return uibox.size.w
}

/** Compute the layout of a graph.
 */
export const uimap = (
  tree: TreeType,
  // validity flags (drop preview)
  flags?: StringMap<BlockDefinition>,
  alayout?: UILayoutType
): UITreeType => {
  const entry = tree.entry
  const layout = alayout || defaultUILayout

  const startpos = {
    x: 0.5,
    y: 0.5 + layout.SLOT,
  }

  const uigraph: UITreeType = {
    version: tree.version,
    nodes: [],
    uiNodeById: {},
    size: { width: 0, height: 0 },
    slots: [],
  }
  uimapOne(tree, entry, flags, layout, uigraph, 0, undefined)

  const height =
    boxPosition(tree, entry, flags, layout, uigraph, startpos) +
    layout.SCLICKH +
    layout.SLOT +
    1
  const width = uigraph.uiNodeById[entry].size.w + 1
  uigraph.size = { width, height }

  return uigraph
}

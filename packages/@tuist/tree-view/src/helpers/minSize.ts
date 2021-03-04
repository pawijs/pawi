import { BlockDefinition, TreeType } from '@tuist/tree'
import { UILayoutType, UINodeSize } from '../types'

/** Compute the minimum size to display the element.
 */
export const minSize = (
  block: BlockDefinition,
  layout: UILayoutType,
  isRoot: boolean = false,
  lock: TreeType['lock']
): UINodeSize => {
  const { childrenCount } = block
  // const needExtraSlot = !meta.children
  let hasExtra = false
  let ds
  if (block.closed) {
    // done
    ds = 0
  } else if (childrenCount !== undefined) {
    // exact children length (and cope for extra detached)
    ds = Math.max(childrenCount, block.children.length)
  } else {
    // Always keep a free slot for untyped children
    ds = Math.max(lock ? lock.slotIdx + 2 : 0, block.children.length + 1)
    hasExtra = true
  }
  // Up slots
  const us = isRoot ? 0 : 1
  // has update = block.meta.isvoid || block.meta.update ? 1 : 0

  const tb = layout.tsizer(block.name)

  let w: number = 6 * layout.ARROW + tb.width + layout.TPAD

  // width down (taken by inlets)
  const wd =
    layout.RADIUS +
    ds * (layout.SPAD + 2 * layout.SLOT) +
    layout.SPAD +
    layout.RADIUS

  // width up (taken by outlets)
  const wu =
    layout.RADIUS +
    us * (layout.SPAD + 2 * layout.SLOT) +
    layout.SPAD +
    layout.RADIUS

  w = Math.ceil(Math.max(w, wd, wu) / layout.GRIDH) * layout.GRIDH

  return {
    cacheName: block.name, // cache reference
    w,
    h: layout.HEIGHT,
    tx: 6 * layout.ARROW,
    ty: layout.HEIGHT / 2 + layout.THEIGHT / 4,
    wd,
    wu,
    ds,
    hasExtra,
    us,
    wde: 0,
  }
}

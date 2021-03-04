import { UIBaseLayoutType, UILayoutType } from '../types'
import { getTextSizeCanvas } from './getTextSizeCanvas'

/** Some constants for graph layout.
 * These could live in a settings object when
 * calling boxLayout and path.
 */
const DEFAULT_LAYOUT = {
  GRIDH: 6,
  HEIGHT: 26,
  THEIGHT: 20,
  RADIUS: 5,
  SLOT: 5,
  ARROW: 3,
  ARROW_OPEN: { path: '', click: '', class: { open: true, arrow: true } },
  ARROW_CLOSED: { path: '', click: '', class: { closed: true, arrow: true } },
  ARROW_CLICK: '',
  SPAD: 16, // slot pad
  SCLICKW: 20,
  SCLICKH: 0, // (computed from HEIGHT) slot click rect height
  TPAD: 8,
  BPAD: 0, // pad between siblings
  PCOUNT: 12, // palette color count must be the same as _palettee.scss
  SUBPADX: 0, // (computed  = 2 * GRIDH) pad in sub assets
  SUBPADY: 4, // (computed  = 2 * GRIDH) pad in sub assets
  VPAD: 0, // vertical padding between boxes
}

const arrow = (l: UIBaseLayoutType, open: boolean): string => {
  const h = l.ARROW
  if (open) {
    // v
    return `M${2 * h + 0} ${l.HEIGHT / 2 - 0} l${h} ${h} l${h} ${-h}`
  } else {
    // >
    return `M${2 * h + h} ${l.HEIGHT / 2 - h} l${h} ${h} l${-h} ${h}`
  }
}

function computeSlotPaths(layout: UIBaseLayoutType): UILayoutType {
  const sl = layout.SLOT
  const r = layout.RADIUS
  const cw = layout.SCLICKW
  const ch = layout.SCLICKH
  // start top left below rounded corner
  const clickp = [`M${-cw / 2} ${-ch / 2 + r}`]
  clickp.push(`a${r} ${r} 0 0 1 ${r} ${-r}`)
  clickp.push(`h${cw - 2 * r}`)
  clickp.push(`a${r} ${r} 0 0 1 ${r} ${r}`)
  clickp.push(`v${ch - 2 * r}`)
  clickp.push(`a${r} ${r} 0 0 1 ${-r} ${r}`)
  clickp.push(`h${-cw + 2 * r}`)
  clickp.push(`a${r} ${r} 0 0 1 ${-r} ${-r}`)
  clickp.push(`v${-ch + 2 * r} z`)

  const invalidLine = Math.ceil((sl * 3) / 2)

  return Object.assign({}, layout, {
    click: clickp.join(''),
    sline: `M${-invalidLine} ${1} h${2 * invalidLine}`,
    spath: `M${-sl} ${0} l${sl} ${-sl} l${sl} ${sl}`,
    plus: `M${-sl} ${0} h${2 * sl} M${0} ${-sl} v${2 * sl}`,
  })
}

export function UILayout(o?: Object): UILayoutType {
  const res: UIBaseLayoutType = Object.assign(
    {},
    DEFAULT_LAYOUT,
    {
      /* must match TreeSVG.tsx CSS */
      tsizer: getTextSizeCanvas('10pt Avenir Next'),
    },
    o || {}
  )
  res.SUBPADX = 2 * res.GRIDH
  res.SCLICKH = Math.min(res.SCLICKW, res.HEIGHT)
  const click = `M0 0 h${6 * res.ARROW} v${res.HEIGHT} h${-6 *
    res.ARROW} v${-res.HEIGHT}`
  res.ARROW_OPEN.path = arrow(res, true)
  res.ARROW_OPEN.click = click
  res.ARROW_CLOSED.path = arrow(res, false)
  res.ARROW_CLOSED.click = click
  return computeSlotPaths(res)
}

export const defaultUILayout = UILayout()

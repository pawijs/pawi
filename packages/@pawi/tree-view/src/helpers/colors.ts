import { adjustHue, darken, desaturate, lighten } from 'polished'

export const pbase = '#aa6'
export const backColor = '#302c2c'
export const high_front = '#D76D01'
export const sel_back = darken(0.08, desaturate(0.7, high_front))
export const high_back = lighten(0.15, desaturate(0.6, high_front))
export const wboxlColor = darken(0.25, backColor) // work box line color
export const pad = '4px' // padding
export const ppad = '8px' // pane side padding
export const wpad = '16px' // workbench padding
export const lbox = '1px' // line around boxes and such
export const lsbo = '1px' // line around svg boxes
export const brad = '4px' // base border radius when used

export const PALETTE_COUNT = 20
export const indices: number[] = Array.from({
  length: PALETTE_COUNT,
}).map((_: any, idx: number) => idx + 1)

// palette background
export function pfill(idx: number) {
  return adjustHue((idx * 360) / PALETTE_COUNT, pbase)
}

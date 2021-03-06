import { GetTextSizeType } from './GetTextSizeType'
import { UIArrowType } from './UINodeType'

export interface UIBaseLayoutType {
  GRIDH: number
  HEIGHT: number
  THEIGHT: number // text height (should be changed if font changes)
  RADIUS: number
  SLOT: number
  ARROW: number
  ARROW_OPEN: UIArrowType
  ARROW_CLOSED: UIArrowType
  ARROW_CLICK: string
  SPAD: number
  SCLICKH: number
  SCLICKW: number
  TPAD: number
  BPAD: number // pad between siblings
  PCOUNT: number // palette color count
  SUBPADX: number // (3*GRIDH) pad in sub assets
  SUBPADY: number // (3*GRIDH) pad with next item
  VPAD: number // vertical padding between boxes
  tsizer: GetTextSizeType
}

export interface UILayoutType extends UIBaseLayoutType {
  sline: string
  spath: string
  plus: string
  click: string
}

export interface Size {
  // Content with padding.
  // content
  c: number
  // top margin
  t: number
  // bottom margin
  b: number
}

export interface Sizes {
  [key: string]: Size
}

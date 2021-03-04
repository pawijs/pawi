export interface ParagraphOptions {
  // Custom tag
  c?: string
  // Options to display paragraphs
  o?: ElementOptions
}

export interface ElementOptions {
  // custom type name (used to get other options such as className, etc)
  t?: string
  // heading level
  h?: number
  // column attibution
  u?: 'l' | 'r'
  // column width
  uw?: number
  // list type
  l?: 'ol' | 'ul'
  href?: string
  // When true: export this paragraph.
  e?: boolean
  // When true: new page before this paragraph
  n?: boolean
  // align (justify, left, center, right)
  a?: 'j' | 'l' | 'c' | 'r'
  // When this is set, special behavior apply like
  // - cannot remove
  // - cannot change paragraph
  // - cannot set bold/etc (no toolbox)
  title?: boolean
  // For custom elements: open popup on selection
  open?: boolean
}

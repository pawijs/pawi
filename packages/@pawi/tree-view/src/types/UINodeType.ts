type StringMap<T = any> = { [k: string]: T }

// This should not be here...
// FIXME: cleanup.
export interface PlaybackMetaType {
  // context changes
  expect?: StringMap
  // one for each slot
  provide?: StringMap
  all?: boolean // set to true if children: 'all'
  isvoid?: boolean // set to true if it has an update but not type for update
  children?: string[]
  update?: string // normalized type
}

export interface CompiledCode {
  js?: string
  scrub?: any // ScrubCode
  meta?: PlaybackMetaType
}

interface MMap<T> {
  [key: string]: T
}

export interface BlockSourceInfo extends CompiledCode {
  // Extra compilation information.
  compiled?: MMap<CompiledCode>
}

export interface BlockType extends BlockSourceInfo {
  id: string
  name: string
  source: string
  // Extra file sources
  sources?: StringMap
}

export interface UIPosType {
  x: number
  y: number
}

export interface UINodeSize {
  // used to skip computation if name did not change
  cacheName: string
  w: number
  h: number
  tx: number // text position x
  ty: number // and y
  wd: number
  wu: number
  ds: number // number of down slots
  hasExtra: boolean // extra slot on right of node
  us: number
  wde: number
}

export interface SlotFlagType {
  free?: boolean
  incompatible?: boolean
  detached?: boolean
}

export interface UISlotType {
  // Center of slot position.
  pos: UIPosType
  // position in slot
  idx: number

  flags: SlotFlagType

  // The fields below could be kept inside layout (constants)
  // slot path
  path: string
  // click area path for the slot (if needed)
  click: string
  // path for plus sign (if needed)
  plus: string
}

export interface UIArrowType {
  path: string
  click: string // click zone
  class: { open?: boolean; closed?: boolean; arrow: boolean }
}

export interface UINodeType {
  type?: string
  name: string
  id: string
  parent: string
  size: UINodeSize
  pos: UIPosType
  sextra: number[]

  // can contain more then one class ( for ghost element )
  className: string
  invalid?: boolean
  closed?: boolean
  // draw path
  path: string
  // path to draw on invalid node
  invalidPath?: string
  // slot paths
  slots: UISlotType[]
  // position in parent
  slotIdx: number
  arrow: UIArrowType
}

export interface UIDropType {
  nodeId: string
  slotId: number
}

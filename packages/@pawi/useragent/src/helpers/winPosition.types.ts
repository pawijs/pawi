// THIS FILE SHOULD BE KEPT IN SYNC WITH '@pawi/useragent'
// UNTIL WE PUBLISH '@pawi/useragent' AND CAN IMPORT
// FROM THERE.

export const winPosition = 'winPosition'
export const winPosition_set = 'winPosition_set'
export const winPosition_onChange = 'winPosition_onChange'
export const winPosition_changed = 'winPosition_changed'

export interface WinPosition {
  x: number
  y: number
  width: number
  height: number
  // set when returning default position (not on a user move/resize)
  default?: boolean
}

export interface WinPositionAPI {
  set(position: WinPosition): void
  // Onchange callback is called right away with default window position
  onChange(clbk: (pos: WinPosition) => void): void
}

declare global {
  interface Window {
    [winPosition]?: WinPositionAPI
  }
}

// THIS FILE SHOULD BE KEPT IN SYNC WITH '@pawi/useragent'
// UNTIL WE PUBLISH '@pawi/useragent' AND CAN IMPORT
// FROM THERE.

export const appBadge = 'appBadge'
export const appBadge_set = 'appBadge_set'

export interface AppBadgeAPI {
  set(text: string): void
}

declare global {
  interface Window {
    [appBadge]?: AppBadgeAPI
  }
}

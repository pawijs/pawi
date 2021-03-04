// THIS FILE SHOULD BE KEPT IN SYNC WITH '@tuist/useragent'
// UNTIL WE PUBLISH '@tuist/useragent' AND CAN IMPORT
// FROM THERE.

export const appUpdate = 'appUpdate'
export const appUpdate_update = 'appUpdate_update'
export const appUpdate_check = 'appUpdate_check'
export const appUpdate_restart = 'appUpdate_restart'

export interface AppUpdateInfo {
  status: 'available' | 'downloading' | 'ready'
  needsRestart: boolean
  releaseDate?: string
  version?: string
  progress?: number
  total?: number
  bytesPerSecond?: number
}

export interface AppUpdateOptions {
  checkInterval: number
  allowPrerelease: boolean
  callback: (arg: AppUpdateInfo) => void
}

export interface AppUpdateAPI {
  version(): string
  onUpdate(opts: AppUpdateOptions): void
  restart(): void
}

declare global {
  interface Window {
    [appUpdate]?: AppUpdateAPI
  }
}

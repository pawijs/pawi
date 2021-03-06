import './appUpdate.types'

export const appVersion = window.appUpdate
  ? () => window.appUpdate?.version()
  : undefined

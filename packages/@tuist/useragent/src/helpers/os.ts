export const isMac = navigator.appVersion.indexOf('Mac') != -1

export function isCommand(e: {
  ctrlKey?: boolean
  metaKey?: boolean
}): boolean {
  return (!isMac && e.ctrlKey) || (isMac && e.metaKey) || false
}

export function agentInformation() {
  return {}
}

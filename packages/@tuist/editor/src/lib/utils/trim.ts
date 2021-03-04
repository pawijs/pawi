export function trimLeft(str: string): string {
  return str.replace(/^\s+/, '')
}

export function trimRight(str: string): string {
  return str.replace(/\s+$/, '')
}

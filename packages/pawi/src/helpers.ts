export function isBare(path: string) {
  return !(
    path.startsWith('./') ||
    path.startsWith('../') ||
    path.startsWith('/') ||
    path === '.'
  )
}

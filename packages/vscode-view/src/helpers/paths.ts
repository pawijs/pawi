export function relativePath(a: string, b: string) {
  const ap = a.split('/')
  const bp = b.split('/')
  while (ap[0] !== undefined && ap[0] === bp[0]) {
    ap.shift()
    bp.shift()
  }
  return [...ap.map(() => '..'), ...bp].join('/')
}

export function getName(path: string) {
  return path
    .split('/')
    .slice(-1)[0]
    .split('.')
    .slice(0, -1)
    .join('.')
    .replace(/\.tui$/, '')
}

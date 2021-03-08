import { isBare } from 'pawi'

export function relativePath(dirname: string, path: string) {
  if (isBare(path)) {
    return path
  }

  const ap = dirname.split('/')
  const bp = path.split('/')
  while (ap[0] !== undefined && ap[0] === bp[0]) {
    ap.shift()
    bp.shift()
  }
  return ['.', ...ap.map(() => '..'), ...bp].join('/')
}

export function getName(path: string) {
  return path
    .split('/')
    .slice(-1)[0]
    .split('.')
    .slice(0, -1)
    .join('.')
    .replace(/\.o$/, '')
}

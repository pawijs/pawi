const INDEX_RE = /index\.o\.[^.]+$/

export function isBare(path: string) {
  return !(
    path.startsWith('./') ||
    path.startsWith('../') ||
    path.startsWith('/') ||
    path === '.'
  )
}

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

export function nameFromFile(file: string) {
  if (INDEX_RE.test(file)) {
    // Branch
    return file.split('/').slice(-2)[0]
  } else {
    return file
      .split('/')
      .slice(-1)[0]
      .split('.')
      .slice(0, -1)
      .join('.')
      .replace(/\.o$/, '')
  }
}

export function libraryName(file: string) {
  return isBare(file)
    ? nameFromFile(file)
    : [
        ...file.split('/').slice(0, -1),
        ...(INDEX_RE.test(file) ? [] : [nameFromFile(file)]),
      ]
        .join('/')
        .replace(/^\.\/\.\.\//, '../')
}

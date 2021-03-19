export function serializeSource(json: string) {
  return `export const branch = \`${json.replace('`', '')}\``
}

export function parseSource(source: string) {
  // FOR OBVIOUS SECURITY REASONS: DO NOT EVALUATE SOURCE !
  return source.slice(source.indexOf('`') + 1, source.lastIndexOf('`'))
}

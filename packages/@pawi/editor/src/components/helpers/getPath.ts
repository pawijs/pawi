export function getPath(
  compId: string,
  anchor: HTMLElement
): string[] | undefined {
  const path: string[] = []
  let elem = anchor
  while (true) {
    const ref = elem.getAttribute('data-ref')
    if (ref) {
      path.unshift(ref)
    } else {
      const id = elem.getAttribute('data-compid')
      if (id === compId) {
        // We have reached the root of the composition
        break
      } else {
        // Just a wrapping item, we haven't reached the root of the composition.
      }
    }
    if (elem === elem.parentElement) {
      // Found root node
      break
    }
    elem = elem.parentElement as HTMLElement
    if (!elem) {
      // Why and how can this happen ?
      return
    }
  }
  if (path.length === 0) {
    // Selection outside of editor: ignore
    return
  }
  return path
}

export function splitText(
  text: string,
  start: number,
  end: number = start
): { before: string; inside: string; after: string } {
  const before = text.substr(0, start)
  const inside = text.substr(start, end - start)
  const after = text.substr(end)
  return { before, inside, after }
}

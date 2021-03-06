export function split(text: string, pos: number): string[] {
  return [text.slice(0, pos), text.slice(pos)]
}

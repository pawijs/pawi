export function isInputEvent(e: React.KeyboardEvent<HTMLDivElement>) {
  // All special arrow and such chars are lower then 65
  // 32 = space bar
  return e.keyCode === 32 || (e.keyCode >= 65 && e.key !== 'Meta')
}

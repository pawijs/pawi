export function themeProxy<T>(theme: T): T {
  return Object.assign(
    {},
    ...Object.keys(theme).map(key => ({ [key]: `var(--${key})` }))
  ) as T
}

export interface BaseContext {
  number: number
  string: string
  time: { now: number; dt: number }
  midi: { songPosition: number }
}

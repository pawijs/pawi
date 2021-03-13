export interface BaseContext {
  number: number
  time: { now: number; dt: number }
  midi: { songPosition: number }
}

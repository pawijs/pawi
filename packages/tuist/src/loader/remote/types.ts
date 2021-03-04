export interface ObserveSocketMessage {
  type: 'observe'
  path: string
  raw: boolean
}

export interface ChangedSocketMessage {
  type: 'changed'
  path: string
  raw: boolean
}

export interface ClearSocketMessage {
  type: 'clear'
}

export type SocketMessage =
  | ObserveSocketMessage
  | ChangedSocketMessage
  | ClearSocketMessage

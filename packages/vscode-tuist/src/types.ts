export interface ReadyMessage {
  type: 'ready'
}

export interface UpdateMessage {
  type: 'update'
  text: string
}

export interface SelectMessage {
  type: 'select'
  path: string
}

export type Message = ReadyMessage | UpdateMessage | SelectMessage

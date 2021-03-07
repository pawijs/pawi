// ============== KEEP IN SYNC vscode-pawi / vscode-view ========== //
// TODO: Is there a better way to keep these types in sync (without publishing an npm
// module just for this ?)

export interface ReadyMessage {
  type: 'ready'
}

export interface UpdateMessage {
  type: 'update'
  // Path of branch file (to get relative path on
  // file drop).
  path: string
  text: string
}

export interface SelectMessage {
  type: 'select'
  path: string
}

export interface LibraryMessage {
  type: 'library'
  paths: string[]
}

export type Message =
  | ReadyMessage
  | UpdateMessage
  | SelectMessage
  | LibraryMessage

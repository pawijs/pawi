// ================ TreeEditor --> VSCode extension

// Inform VSCode that we are ready to receive messages.
export interface ReadyMessage {
  type: 'ready'
}

// Open a file in VSCode
export interface OpenFileMessage {
  type: 'openFile'
  path: string
  focus: boolean
}

// Create a new file in VSCode
export interface CreateFileMessage {
  type: 'createFile'
  path: string
  // Optional path to an existing file whose content we
  // should copy
  fromPath?: string
}

// Rename a file.
// When the rename operation is done in VSCode, this will trigger
// a FileRenameEvent which we listen and we update branches accordingly,
// sending 'updateBranch' and 'if needed.
export interface RenameFileMessage {
  type: 'renameFile'
  oldPath: string
  newPath: string
}

// ================ VSCode extension <-> TreeEditor

// Inform other party that the branch definition has changed
export interface UpdateBranchMessage {
  type: 'updateBranch'
  // Path of branch file
  path: string
  // Branch definition as JSON
  branch: string
}

// ================ VSCode extension --> TreeEditor

export interface LibraryMessage {
  type: 'library'
  paths: string[]
}

// Inform library that a file's name/path has changed (we do not handle branch
// changes as these are dealt with by the extension).

export interface FileCreatedMessage {
  type: 'fileCreated'
  path: string
}

export interface FileDeletedMessage {
  type: 'fileDeleted'
  path: string
}

export interface FileRenamedMessage {
  type: 'fileRenamed'
  oldPath: string
  newPath: string
}

export type EditorToVSCodeMessage =
  | ReadyMessage
  | OpenFileMessage
  | CreateFileMessage
  | RenameFileMessage
  | UpdateBranchMessage

export type VSCodeToEditorMessage =
  | LibraryMessage
  | FileCreatedMessage
  | FileDeletedMessage
  | FileRenamedMessage
  | UpdateBranchMessage

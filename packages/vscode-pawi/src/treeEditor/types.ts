import { Disposable, TextDocument } from 'vscode'
import { Message } from '../message.types'

export const TREE_EDITOR_VIEW_TYPE = 'vscode-pawi.treeEditor'

export interface TreeEditor {
  document: TextDocument
  disposables: Disposable[]
  send: (msg: Message) => void
}

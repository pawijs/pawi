import { Disposable, TextDocument, WebviewPanel } from 'vscode'
import { EditorToVSCodeMessage, VSCodeToEditorMessage } from '../message.types'

export const TREE_EDITOR_VIEW_TYPE = 'vscode-pawi.treeEditor'

export interface TreeEditorProxy {
  document: TextDocument
  disposables: Disposable[]
  send: (msg: VSCodeToEditorMessage) => void
}

export interface ReceiveArgument<T = EditorToVSCodeMessage> {
  editor: TreeEditorProxy
  panel: WebviewPanel
  msg: T
}

export interface SendArgument<T extends VSCodeToEditorMessage>
  extends Omit<TreeEditorProxy, 'send'> {
  send(arg: T): void
}

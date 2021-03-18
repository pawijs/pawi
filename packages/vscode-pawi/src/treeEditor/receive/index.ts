import { WebviewPanel } from 'vscode'
import { EditorToVSCodeMessage } from '../../message.types'
import { ReceiveArgument, TreeEditorProxy } from '../types'
import { createFile } from './createFile'
import { openFile } from './openFile'
import { ready } from './ready'
import { renameFile } from './renameFile'
import { updateBranch } from './updateBranch'

type Operations<Type extends string> = {
  [prop in Type]: (arg: ReceiveArgument<any>) => void
}

const OPERATIONS: Operations<EditorToVSCodeMessage['type']> = {
  ready,
  updateBranch,
  openFile,
  createFile,
  renameFile,
}

export function registerReceive(editor: TreeEditorProxy, panel: WebviewPanel) {
  panel.webview.onDidReceiveMessage(async (msg: EditorToVSCodeMessage) => {
    OPERATIONS[msg.type]({ editor, panel, msg })
  })
}

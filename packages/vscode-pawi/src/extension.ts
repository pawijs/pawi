import * as vscode from 'vscode'
import { setupFileWatcher } from './fileWatcher'
import { TreeEditorProvider } from './treeEditor/TreeEditorProvider'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(TreeEditorProvider.register(context))
  setupFileWatcher(context.subscriptions)
}

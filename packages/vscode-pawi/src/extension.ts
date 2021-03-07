import * as vscode from 'vscode'
import { TreeEditorProvider } from './treeEditor/TreeEditorProvider'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(TreeEditorProvider.register(context))
}

import * as vscode from 'vscode'
import { TreeEditor } from './TreeEditor'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(TreeEditor.register(context))
}

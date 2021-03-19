import * as vscode from 'vscode'
import { registerOnDelete } from './onDelete'
import { registerOnRename } from './onRename'

export function setupFileWatcher(disposables: vscode.Disposable[]) {
  disposables.push(registerOnDelete())
  disposables.push(registerOnRename())
}

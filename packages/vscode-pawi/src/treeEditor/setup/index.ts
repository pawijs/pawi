import { TextDocument, Uri, WebviewPanel } from 'vscode'
import { registerReceive } from '../receive'
import { TreeEditorProxy } from '../types'
import { setHtml } from './html'
import { registerOnChange } from './onChange'
import { registerOnCreate } from './onCreate'
import { registerOnDelete } from './onDelete'
import { registerOnRename } from './onRename'

export function setupEditor(
  extensionUri: Uri,
  document: TextDocument,
  panel: WebviewPanel
) {
  setHtml(extensionUri, panel)
  const webview = panel.webview

  const editor: TreeEditorProxy = {
    document,
    send: msg => {
      // console.log('SEND', msg)
      webview.postMessage(msg)
    },
    disposables: [],
  }

  panel.onDidDispose(() => editor.disposables.forEach(d => d.dispose()))

  registerReceive(editor, panel)
  registerOnChange(editor)
  registerOnCreate(editor)
  registerOnDelete(editor)
  registerOnRename(editor)
}

import { TextDocument, Uri, WebviewPanel } from 'vscode'
import { registerReceive } from '../receive'
import { TreeEditor } from '../types'
import { setHtml } from './html'
import { registerOnChange } from './onChange'

export function setupEditor(
  extensionUri: Uri,
  document: TextDocument,
  panel: WebviewPanel
) {
  setHtml(extensionUri, panel)
  const webview = panel.webview

  const editor: TreeEditor = {
    document,
    send: msg => {
      // console.log('SEND', msg)
      webview.postMessage(msg)
    },
    disposables: [],
  }

  panel.onDidDispose(() => editor.disposables.forEach(d => d.dispose()))

  registerOnChange(editor)
  registerReceive(editor, panel)
}

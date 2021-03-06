import { glob } from 'glob'
import * as vscode from 'vscode'
import { Message } from './types'

const HTML = `
<!doctype html><base href="./"><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Tuist</title><link href="/app.css" rel="stylesheet"></head><body><div id="root"></div><script defer="defer" src="/app.js"></script></body></html>
`

function getFiles(cwd: string) {
  return new Promise<string[]>((resolve, reject) =>
    glob('**/*.tui.ts', { cwd }, (err, files) => {
      if (err) {
        reject(err)
      }
      resolve(files.map(f => `${cwd}/${f.replace(/\.ts$/, '.js')}`))
    })
  )
}

export class TreeEditor implements vscode.CustomTextEditorProvider {
  private static readonly viewType = 'vscode-tuist.treeEditor'
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const editor = new TreeEditor(context)
    return vscode.window.registerCustomEditorProvider(
      TreeEditor.viewType,
      editor
    )
  }

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    }
    webviewPanel.webview.html = this.getHtmlForWebView(webviewPanel.webview)

    function send(msg: Message) {
      console.log('EXT:SEND', msg)
      webviewPanel.webview.postMessage(msg)
    }

    function updateWebview() {
      // Inform editor of new content
      send({
        type: 'update',
        path: document.uri.path,
        text: document.getText(),
      })
    }
    async function sendLibrary() {
      const files: string[] = []
      const folders = vscode.workspace.workspaceFolders?.map(f => f.uri.path)
      if (folders) {
        for (const cwd of folders) {
          files.push(...(await getFiles(cwd)))
        }
        send({
          type: 'library',
          paths: files,
        })
      }
    }

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
      e => {
        if (e.document.uri.toString() === document.uri.toString()) {
          updateWebview()
        }
      }
    )

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose()
    })

    const base = document.uri

    webviewPanel.webview.onDidReceiveMessage(async (msg: Message) => {
      // receive changes from editor
      console.log('EXT:RECV', msg.type)
      switch (msg.type) {
        case 'select': {
          const uri = vscode.Uri.file(
            base.path + '/../' + msg.path.replace(/.js$/, '.ts')
          )
          let doc = await vscode.workspace.openTextDocument(uri)
          const column =
            webviewPanel.viewColumn === vscode.ViewColumn.One
              ? vscode.ViewColumn.Two
              : vscode.ViewColumn.One
          vscode.window.showTextDocument(doc, column)
          break
        }
        case 'update': {
          this.updateDocument(document, msg.text)
          break
        }
        case 'ready': {
          updateWebview()
          sendLibrary()
          break
        }
      }
    })
  }

  private updateDocument(document: vscode.TextDocument, text: string) {
    const edit = new vscode.WorkspaceEdit()
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      text
    )
    return vscode.workspace.applyEdit(edit).then(() => document.save())
  }

  private getHtmlForWebView(webview: vscode.Webview) {
    const viewUrl = (path: string) =>
      webview.asWebviewUri(
        vscode.Uri.joinPath(this.context.extensionUri, 'view', path)
      )
    return HTML.replace('/app.js', viewUrl('app.js').toString()).replace(
      '/app.css',
      viewUrl('app.css').toString()
    )
  }
}

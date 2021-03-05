import * as vscode from 'vscode'
import { Message } from './types'

const HTML = `
<!doctype html><base href="./"><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Tuist</title><link href="/app.css" rel="stylesheet"></head><body><div id="root"></div><script defer="defer" src="/app.js"></script></body></html>
`

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

    function updateWebview() {
      // Inform editor of new content
      webviewPanel.webview.postMessage({
        type: 'update',
        text: document.getText(),
      })
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

    webviewPanel.webview.onDidReceiveMessage(async (e: Message) => {
      // receive changes from editor
      console.log('RECEIVE', e)
      switch (e.type) {
        case 'select': {
          const uri = vscode.Uri.file(
            base.path + '/../' + e.path.replace(/.js$/, '.ts')
          )
          let doc = await vscode.workspace.openTextDocument(uri)
          vscode.window.showTextDocument(doc, vscode.ViewColumn.One)
          vscode.commands.executeCommand(
            'vscode.open',
            uri,
            vscode.ViewColumn.One
          )
          break
        }
        case 'update': {
          this.updateDocument(document, e.text)
          break
        }
        case 'ready': {
          updateWebview()
          break
        }
      }
    })
  }

  private updateDocument(document: vscode.TextDocument, data: any) {
    const edit = new vscode.WorkspaceEdit()
    // replace entire document for now
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      JSON.stringify(data, null, 2)
    )
    return vscode.workspace.applyEdit(edit)
  }

  private getHtmlForWebView(webview: vscode.Webview) {
    const viewUrl = (path: string) =>
      webview.asWebviewUri(
        vscode.Uri.joinPath(this.context.extensionUri, 'assets', path)
      )
    return HTML.replace('/app.js', viewUrl('app.js').toString()).replace(
      '/app.css',
      viewUrl('app.css').toString()
    )
  }
}

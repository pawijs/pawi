// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path'
import * as vscode from 'vscode'

export function registerPanel(context: vscode.ExtensionContext) {
  const assets = vscode.Uri.file(path.join(context.extensionPath, 'assets'))
  return vscode.commands.registerTextEditorCommand(
    'vscode-tuist.edit',
    textEditor => {
      const panel = vscode.window.createWebviewPanel(
        'tuistEditor',
        'Tuist Editor',
        textEditor.viewColumn || vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [assets],
        }
      )
      const viewUrl = (path: string) =>
        panel.webview.asWebviewUri(
          vscode.Uri.joinPath(context.extensionUri, 'assets', path)
        )

      panel.webview.onDidReceiveMessage(
        message => {
          vscode.window.showErrorMessage(message)
        },
        undefined,
        context.subscriptions
      )

      panel.webview.html = HTML.replace(
        '/app.js',
        viewUrl('app.js').toString()
      ).replace('/app.css', viewUrl('app.css').toString())
      panel.reveal(textEditor.viewColumn)
    }
  )
}

const HTML = `
<!doctype html><base href="./"><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Tuist</title><link href="/app.css" rel="stylesheet"></head><body><div id="root"></div><script defer="defer" src="/app.js"></script></body></html>
`

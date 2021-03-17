import { Uri, WebviewPanel } from 'vscode'

const HTML = `
<!doctype html><base href="./"><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Pawi</title></head><body><div id="root"></div><script defer="defer" type="module" src="/boot.js"></script></body></html>
`

export function setHtml(extensionUri: Uri, { webview }: WebviewPanel) {
  webview.options = {
    enableScripts: true,
  }

  const viewUrl = (path: string) =>
    webview.asWebviewUri(Uri.joinPath(extensionUri, 'view', path))

  webview.html = HTML.replace('/boot.js', viewUrl('boot.js').toString())
}

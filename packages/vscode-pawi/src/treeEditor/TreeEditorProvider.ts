import * as vscode from 'vscode'
import { setupEditor } from './setup'
import { TEXT_EDITOR_VIEW_TYPE } from './types'

export class TreeEditorProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new TreeEditorProvider(context.extensionUri)
    return vscode.window.registerCustomEditorProvider(
      TEXT_EDITOR_VIEW_TYPE,
      provider
    )
  }

  constructor(private readonly extensionUri: vscode.Uri) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    setupEditor(this.extensionUri, document, webviewPanel)
  }
}

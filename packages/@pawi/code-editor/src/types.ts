import * as actions from './actions'

export interface CodeData {
  code: {
    lang: string
    source: string
  }
}

export interface CodeEditorConfig {
  state: {
    codeEditor: {}
  }

  actions: {
    codeEditor: typeof actions
  }
}

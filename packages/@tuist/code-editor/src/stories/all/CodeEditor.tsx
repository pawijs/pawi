import { CodeEditor as component, CodeEditorProps as Props } from '../..'
import { config, Stories } from '../helper'

export const codeEditor: Stories<Props> = {
  name: 'CodeEditor',
  config: config,
  stories: [
    {
      name: 'simple',
      component,
      props: ctx => ({
        id: 'foo',
        source: `const foo = 'bar'`,
        lang: 'ts',
        onChange() {
          console.log('save')
        },
      }),
    },
  ],
}

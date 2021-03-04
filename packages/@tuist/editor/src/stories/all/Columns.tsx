// import * as React from 'react'
// import styled from 'styled-components'
import { Editor as component, EditorProps as Props } from '../..'
import { config, Stories, wrapper } from '../helpers'

/*
const SomeChild = styled.div`
  border: 1px solid #333;
  background: #aaa;
  height: 80px;
  padding: 20px;
  color: #eee;
`
*/

export const editorStories: Stories<Props> = {
  name: 'Editor',
  component,
  config,
  wrapper,
  stories: [
    {
      name: 'many pages',
      props(ctx) {
        return { holder: ctx.state.test.c1 }
      },
    },
  ],
}

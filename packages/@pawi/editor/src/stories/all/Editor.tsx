import * as React from 'react'

import { EditorProps as Props, Editor as component } from '../..'
import { Stories, config, wrapper } from '../helpers'

import styled from 'styled-components'

const SomeChild = styled.div`
  border: 1px solid #333;
  background: #aaa;
  height: 80px;
  padding: 20px;
  color: #eee;
`

export const editorStories: Stories<Props> = {
  name: 'Editor',
  component,
  config,
  wrapper,
  stories: [
    {
      name: 'with title',
      props(ctx) {
        return { holder: ctx.state.test.e1 }
      },
    },

    {
      name: 'with title children',
      state: {
        test: {
          showTitleChildren: true,
        },
      },
      props(ctx) {
        return { holder: ctx.state.test.e1 }
      },
    },

    {
      name: 'with children',
      props(ctx) {
        return { holder: ctx.state.test.e1 }
      },
      children: [<SomeChild key="1">This is a child</SomeChild>],
    },

    {
      name: 'no composition',
      props(ctx) {
        return {
          holder: ctx.state.test.e5,
          titlePlaceholder: 'New Composition',
        }
      },
    },

    {
      name: 'no composition and no title',
      props(ctx) {
        return {
          holder: ctx.state.test.e6,
          titlePlaceholder: 'New Composition',
        }
      },
    },

    {
      name: 'title true',
      props(ctx) {
        return { holder: ctx.state.test.e2 }
      },
    },

    {
      name: 'no title',
      props(ctx) {
        return { holder: ctx.state.test.e3 }
      },
    },

    {
      name: 'list',
      props(ctx) {
        return { holder: ctx.state.test.e7 }
      },
    },

    {
      name: 'many pages',
      props(ctx) {
        return { holder: ctx.state.test.e4 }
      },
    },

    {
      name: 'readonly',
      props(ctx) {
        return { holder: ctx.state.test.e4, readonly: true }
      },
    },
  ],
}

import { Action, TestConfig } from './app'
import { Block, build, settings } from '@tuist/build'
import { Doc, DocDrag, Name, NameDrag } from './Doc'
import { DragdropSettings, dragdrop } from '../..'

import { DragTransform } from '../../types'

export * from './app'
export * from './Doc'
export * from './Group'

const showPayload: Action<any> = (_, value) => {
  alert(`showPayload: ${JSON.stringify(value)}`)
}

const moveToGroup: Action<DocDrag & { target: string }> = (
  { state },
  value
) => {
  const { name, isName, group, target } = value
  delete state.groups[group][name]
  state.groups[target][name] = { name, isName }
}

// On drag start, this is called and transforms a 'Doc' into a 'Name' given
// some properties. The use case is for custom paragraphs dragged as a
// tree for example. And then a tree can be seen as a paragraph on drop with
// the 'accept' transforms.
const docToName: DragTransform<any, DocDrag, NameDrag> = function (
  ctx,
  dragData
) {
  const { payload } = dragData
  if (!payload.isName) {
    return undefined
  }

  return {
    type: 'name',
    payload: { stuff: { name: payload.name, group: payload.group } },
    anchor: dragData.anchor,
  }
}

// On drop hover, this is called and transforms a 'Name' into a 'Doc'.
// The use case is for a tree dragged and drop as a paragraph.
const nameToDoc: DragTransform<any, NameDrag, DocDrag> = function (
  ctx,
  dragData
) {
  const { stuff } = dragData.payload
  return {
    type: 'doc',
    payload: { name: stuff.name, group: stuff.group, isName: true },
    anchor: dragData.anchor,
  }
}

const test: Block<TestConfig> = {
  name: 'test',
  settings: settings<DragdropSettings>({
    dragdrop: {
      types: {
        doc: {
          // Element to show when dragging type 'doc'
          component: Doc,
          dragProps: { myprop: 'dragging ' },
        },
        name: {
          component: Name,
        },
      },
      dragTransform: {
        doc: {
          // transforms a 'doc' to a 'name' on drag start
          name: docToName,
        },
      },
      dropTransform: {
        name: {
          // transforms a 'name' to a 'doc' on drop hover
          doc: nameToDoc,
        },
      },
    },
  }),
  actions: {
    test: {
      showPayload,
    },
    group: {
      moveToGroup,
    },
  },
  state: {
    groups: {},
  },
}

export const config = build(test).using(dragdrop).config()

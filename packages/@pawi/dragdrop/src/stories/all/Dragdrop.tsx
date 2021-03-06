import { Stories } from '@pawi/story'
import * as React from 'react'
import { Drag, DraggingProps as Props } from '../..'
import { useOvermind } from '../../app'
import { dropStyles } from '../../components'
import { fileDrop } from '../../fileDrop'
import { Comp, config, Doc, Group, Group2, styled } from '../helpers'

const component = styled(Drag)`
  background: rgba(255, 255, 255, 0.8);
`
const FileDropDiv = styled.div`
  margin: 10px;
  padding: 10px;
  width: 100px;
  height: 50px;
  ${dropStyles};
`

const filedrop: Comp = () => {
  useOvermind()
  const ref = React.useRef(null)

  return (
    <FileDropDiv
      {...fileDrop({
        ref,
        onDrop(args) {
          console.log('dropped', args)
        },
        payload: { collectionId: 'someCollectionId' },
      })}
    >
      FILE DROP HERE
    </FileDropDiv>
  )
}

export const dragdropStories: Stories<Props> = {
  config,
  component,
  name: 'Dragdrop',
  stories: [
    {
      name: 'dragging',
      props: {},
      state: {
        dragdrop: {
          drag: {
            type: 'doc',
            anchor: { x: 10, y: 10 },
            payload: { name: 'Lily', age: 19 },
          },
          position: { x: 320, y: 90 },
        },
      },
    },

    {
      name: 'start drag',
      props: {},
      wrapper: ({ children }: any) => (
        <div>
          {children}
          <Doc name="My name" group="dummy" />
        </div>
      ),
    },

    {
      name: 'file drop',
      component: filedrop,
    },

    {
      name: 'drag & drop',
      props: {},
      wrapper: ({ children }: any) => (
        <div>
          {children}
          {/* Details of how the drop works are in ../helpers/Group */}
          <Group group="foo" />
          <Group group="bar" />
          <Group2 group="baz" />
        </div>
      ),
      state: {
        groups: {
          foo: {
            hop: { name: 'hop' },
            lala: { name: 'lala' },
          },
          bar: {
            bar: { name: 'bar' },
            Lily: { name: 'Lily', isName: true },
          },
          baz: {},
        },
      },
    },

    {
      name: 'transform',
      props: {},
      wrapper: ({ children }: any) => (
        <div>
          {children}
          {/* Details of how the drop works are in ../helpers/Group */}
          <Group group="foo" />
          <Group group="bar" />
          <Group2 group="baz" />
        </div>
      ),
      state: {
        groups: {
          foo: {
            hop: 'hop',
            lala: 'lala',
          },
          bar: {
            bar: 'bar',
          },
          baz: {},
        },
      },
    },
  ],
}

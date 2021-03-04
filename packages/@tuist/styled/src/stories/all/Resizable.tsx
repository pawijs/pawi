import { ResizableProps as Props, Resizable } from '../..'
import { styled } from '../../app'
import { ResizeArg } from '../../components'
import { config, Stories } from '../helpers'

const component = styled(Resizable)`
  background: #ffbcf6;
  border: 1px solid #333;
  width: 50px;
  height: 50px;
`

export const resizableStories: Stories<Props> = {
  name: 'Resizable',
  component,
  config,
  state: {
    height: 100,
    width: 200,
  },
  actions: {
    resize(ctx: any, arg: ResizeArg) {
      if (arg.height) {
        ctx.state.height = arg.height
      }
      if (arg.width) {
        ctx.state.width = arg.width
      }
    },
  },
  stories: [
    {
      name: 'height',
      props(ctx: any) {
        return {
          height: ctx.state.height,
          onResize: ctx.actions.resize,
        }
      },
    },
    {
      name: 'width',
      props(ctx: any) {
        return {
          width: ctx.state.width,
          onResize: ctx.actions.resize,
        }
      },
    },
    {
      name: 'height & width',
      props(ctx: any) {
        return {
          height: ctx.state.height,
          width: ctx.state.width,
          onResize: ctx.actions.resize,
        }
      },
    },
    {
      name: 'type:height',
      props: {
        type: 'height',
        name: 'foo',
      },
    },
    {
      name: 'type:width',
      props: {
        type: 'width',
        name: 'bar',
      },
    },
    {
      name: 'type:both',
      props: {
        type: 'both',
        name: 'baz',
      },
    },
  ],
}

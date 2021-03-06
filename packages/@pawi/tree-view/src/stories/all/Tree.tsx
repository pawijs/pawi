import { Tree as component, TreeProps as Props } from '../..'
import { config, Stories, Wrapper } from '../helper'

export const tree: Stories<Props> = {
  name: 'Tree',
  config,
  wrapper: Wrapper,
  stories: [
    {
      name: 'simple',
      component,
      props: ctx => ({
        tree: ctx.state.test.graph,
      }),
    },

    {
      name: 'partial',
      component,
      props: ctx => ({
        tree: ctx.state.test.graph,
        nodeId: 'bazId',
      }),
    },
    /*
    {
      name: 'dragging',
      component,
      state: {
        dragdrop: {
          drag: {
            type: 'tree',
            anchor: { x: 10, y: 10 },
            payload: { graph },
          },
          position: { x: 220, y: 510 },
        },
      },
      props: ctx => ({
        graph: ctx.state.test.graph,
      }),
    },
    */
  ],
}

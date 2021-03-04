import { Node as component, NodeProps as Props } from '../..'
import { config, Stories, svgWrapper } from '../helper'

export const node: Stories<Props> = {
  name: 'Node',
  config: config,
  wrapper: svgWrapper,
  stories: [
    {
      name: 'simple',
      component,
      props: ctx => ({
        tree: ctx.state.test.graph,
        uinode: ctx.state.test.uigraph.uiNodeById['fooId'],
      }),
    },
  ],
}

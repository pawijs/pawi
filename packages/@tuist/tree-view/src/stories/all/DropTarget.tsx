import { DropTarget as component, DropTargetProps as Props } from '../..'
import { config, Stories, svgWrapper } from '../helper'

export const dropTarget: Stories<Props> = {
  name: 'DropTarget',
  config: config,
  wrapper: svgWrapper,
  stories: [
    {
      name: 'simple',
      component,
      props: ctx => ({
        slotIdx: 0,
        uinode: ctx.state.test.uigraph.uiNodeById['fooId'],
      }),
    },
  ],
}

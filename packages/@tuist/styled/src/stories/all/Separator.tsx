import { Stories, config } from '../helpers'

import { ComponentWrapper } from '@tuist/story'
import { Separator as component } from '../..'
import { styled } from '../../app'

const Wrapper = styled(ComponentWrapper)`
  display: flex;
  width: 20rem;
  padding: 10px;
`

export const separatorStories: Stories<{}> = {
  component,
  config,
  wrapper: Wrapper,
  name: 'Separator',
  stories: [
    {
      name: 'simple',
      props: {},
    },

    {
      name: 'theme separatorBorder',
      props: {},
      theme: { separatorBorder: '1px solid orange' },
    },
  ],
}

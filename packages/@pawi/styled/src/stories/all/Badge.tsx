import * as React from 'react'

import { Badge, Icon as component, IconProps as Props } from '../..'
import { config, Stories } from '../helpers'

export const badgeStories: Stories<Props> = {
  name: 'Badge with icon',
  component,
  config,
  stories: [
    {
      name: '5',
      props: { icon: 'email' },
      children: <Badge>5</Badge>,
    },

    {
      name: '99',
      props: { icon: 'email' },
      children: <Badge>99</Badge>,
    },

    {
      name: 'plus',
      props: { icon: 'email' },
      children: (
        <Badge style={{ background: '#367136e2', fontSize: '1rem' }}>+</Badge>
      ),
    },
  ],
}

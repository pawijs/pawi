import { mutate } from 'overmind'
import * as React from 'react'
import { Stories } from '../..'
import { Comp } from '../../app'

const DefaultComponent: Comp<{ name: string }> = ({ name }) => (
  <div>This is {name}</div>
)

const wrapper: Comp = ({ children }) => <div>{children}</div>

export const storiesDefaults: Stories<{ name: string }> = {
  name: 'defaults in Stories',
  props: { name: 'foo' },
  component: DefaultComponent,
  wrapper,
  titleClick: mutate(() => alert('Title click')),
  stories: [
    {
      name: 'simple all defaults',
    },
  ],
}

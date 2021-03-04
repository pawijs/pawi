import { Children as component, ChildrenProps } from '../..'
import { config, Stories } from '../helpers'

export const children: Stories<ChildrenProps> = {
  name: 'Children',
  component,
  config,
  stories: [
    {
      name: 'base',
      props: { family: 'base' },
    },
    {
      name: 'work',
      props: { family: 'work' },
    },
    {
      name: 'base & work',
      props: { family: { base: true, work: true } },
    },
  ],
}

import { CardTitle as component, CardTitleProps } from '../..'
import { config, Stories } from '../helpers'

export const cardTitleStories: Stories<CardTitleProps> = {
  component,
  config,
  name: 'CardTitle',
  stories: [
    {
      name: 'translated',
      props: { titleKey: 'Welcome' },
    },

    {
      name: 'raw title',
      props: { title: 'Something not translated' },
    },

    {
      name: 'single',
      props: { titleKey: 'Welcome', single: true },
    },

    {
      name: 'icon single',
      props: { titleKey: 'Welcome', icon: 'user', single: true },
    },

    {
      name: 'icon single spin',
      props: { titleKey: 'Loading', icon: 'loading', single: true, spin: true },
    },
  ],
}

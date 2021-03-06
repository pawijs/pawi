import { Message as component, MessageProps as Props } from '../..'
import { config, Stories } from '../helpers'

export const messageStories: Stories<Props> = {
  component,
  config,
  name: 'Message',
  stories: [
    {
      name: 'simple',
      props: { text: 'Welcome' },
    },

    {
      name: 'icon',
      props: { text: 'PleaseLogin', icon: 'user' },
    },

    {
      name: 'icon no text',
      props: { icon: 'user' },
    },

    {
      name: 'icon true',
      props: { text: 'PleaseLogin', icon: true },
    },

    {
      name: 'replace',
      props: { text: 'DearFriend', replace: { FRIEND: 'Lily' } },
    },
  ],
}

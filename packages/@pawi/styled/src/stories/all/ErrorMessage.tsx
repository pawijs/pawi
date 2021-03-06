import { ErrorMessage as component, ErrorMessageProps as Props } from '../..'
import { config, Stories } from '../helpers'

export const errorMessageStories: Stories<Props> = {
  component,
  config,
  name: 'ErrorMessage',
  stories: [
    {
      name: 'error',
      props: { errorKey: 'TooManyEmotions' },
    },

    {
      name: 'error not translated',
      props: { error: 'Hey this is an error.' },
    },

    {
      name: 'error icon true',
      props: { errorKey: 'TooManyEmotions', icon: true },
    },

    {
      name: 'icon',
      props: { errorKey: 'TooManyEmotions', icon: 'user' },
    },

    {
      name: 'no error',
      props: { errorKey: undefined, icon: true },
    },
  ],
}

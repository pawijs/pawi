import {
  ShowMessage as component,
  ShowMessageProps as Props,
} from '../helpers/ShowMessage'
import { config, Stories } from '../helpers'

export const simpleStories: Stories<Props> = {
  name: 'Show shorcuts',
  component,
  config,
  stories: [
    {
      name: 'use arrows inside and outside input',
    },
  ],
}

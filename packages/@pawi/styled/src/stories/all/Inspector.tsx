import { Inspector as component, InspectorProps as Props } from '../..'
import { config, Stories } from '../helpers'
import { mutate } from 'overmind'

export const inspector: Stories<Props> = {
  name: 'Inspector',
  component,
  config,
  stories: [
    {
      titleClick: mutate(({ state }) => {
        state.test.hasDocument = !state.test.hasDocument
      }),
      name: 'inspector',
    },
  ],
}

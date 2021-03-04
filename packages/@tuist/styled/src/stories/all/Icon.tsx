import { mutate } from 'overmind'
import { Icon as component, IconProps as Props } from '../..'
import { config, Stories } from '../helpers'

export const iconStories: Stories<Props> = {
  name: 'Icon FontAwesome',
  component,
  config,
  stories: [
    {
      name: 'simple',
      props: { icon: 'user' },
    },

    {
      name: 'tip',
      titleClick({ state }) {
        state.styled.showTips = !state.styled.showTips
      },
      props: { icon: 'user', tip: 'userTip' },
    },

    {
      name: 'medium',
      props: { icon: 'user', medium: true },
    },

    {
      name: 'large',
      props: { icon: 'user', large: true },
    },

    {
      name: 'hasOn',
      titleClick({ state }) {
        state.test.open = !state.test.open
      },
      props: ({ state }) => ({
        // component is not really created: props only used to display
        icon: 'folder',
        hasOn: true,
        highlighted: state.test.open,
        onClick() {
          alert('Click on title')
        },
      }),
    },

    {
      name: 'hasOn is on',
      titleClick: mutate(({ state }) => (state.test.open = !state.test.open)),
      props: ({ state }) => ({
        // component is not really created: props only used to display
        icon: 'folder',
        hasOn: true,
        highlighted: state.test.open,
        onClick() {
          alert('Click on title')
        },
      }),
      state: {
        test: {
          open: true,
        },
      },
    },
  ],
}

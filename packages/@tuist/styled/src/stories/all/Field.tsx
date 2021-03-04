import { Field as component, FieldProps as Props } from '../..'
import { config, Stories } from '../helpers'

export const fieldStories: Stories<Props> = {
  name: 'Field',
  component,
  config,
  stories: [
    {
      name: 'simple',
      props: ({ state }) => ({ form: state.login, name: 'username' }),
      state: {
        login: {
          username: 'someuser',
        },
      },
    },

    {
      name: 'checkbox',
      props: ({ state }) => ({
        form: state.login,
        name: 'admin',
        type: 'checkbox',
        label: true,
      }),
      state: {
        login: {
          username: 'someuser',
        },
      },
    },

    {
      name: 'select',
      props: ({ state }) => ({
        form: state.login,
        name: 'collId',
        type: 'select',
        icon: 'user',
        label: true,
        includeBlank: true,
        options: [
          { key: 'one', value: 'This is one' },
          { key: 'two', value: 'This is two' },
        ],
      }),
      state: {
        login: {
          username: 'someuser',
        },
      },
    },

    {
      name: 'submit',
      props: app => ({
        form: app.state.login,
        name: 'username',
        submit: app.actions.login.submit,
      }),
      state: {
        login: {
          username: 'someuser',
        },
      },
    },

    {
      name: 'field icon',
      props: ({ state }) => ({
        form: state.login,
        name: 'username',
        icon: 'user',
      }),
      state: {
        login: {
          username: 'someuser',
        },
      },
    },

    {
      name: 'field icon true',
      props: ({ state }) => ({
        form: state.login,
        name: 'username',
        icon: true,
      }),
      state: {
        login: {
          password: '',
        },
      },
    },

    {
      name: 'field disabled reset',
      props: ({ state }) => ({
        form: state.login,
        name: 'username',
        disabled: true,
        reset: true,
        resetIcon: 'username',
        icon: true,
      }),
      state: {
        login: {
          username: 'Hello',
        },
      },
    },

    {
      name: 'huge fieldBorderRadius',
      props: ({ state }) => ({
        form: state.login,
        name: 'username',
        icon: 'user',
      }),
      state: {
        login: {
          username: 'John Lily',
        },
      },
      theme: {
        fieldBorderRadius: '15px',
      },
    },
  ],
}

import { Button as component, ButtonProps as Props, Link } from '../..'
import { config, Stories } from '../helpers'

export const buttonStories: Stories<Props> = {
  name: 'Button',
  component,
  config,
  stories: [
    {
      name: 'simple',
      props: ctx => ({
        textKey: 'Validate',
        onClick: ctx.actions.login.submit,
      }),
    },

    {
      name: 'primary',
      props(ctx) {
        return {
          textKey: 'Validate',
          primary: true,
          onClick: ctx.actions.login.submit,
        }
      },
    },

    {
      name: 'large',
      props(ctx) {
        return {
          textKey: 'Validate',
          large: true,
          onClick: ctx.actions.login.submit,
        }
      },
    },

    {
      name: 'primary large',
      props: ctx => ({
        textKey: 'Validate',
        onClick: ctx.actions.login.submit,
        large: true,
        primary: true,
      }),
    },

    {
      name: 'disabled',
      props: ctx => ({
        textKey: 'Validate',
        onClick: ctx.actions.login.submit,
        disabled: true,
      }),
    },

    {
      name: 'icon',
      props: ctx => ({
        textKey: 'Validate',
        onClick: ctx.actions.login.submit,
        icon: 'user',
      }),
    },

    {
      name: 'icon true',
      props: ctx => ({
        textKey: 'Validate',
        onClick: ctx.actions.login.submit,
        icon: true,
      }),
    },

    {
      name: 'icon large',
      props: ctx => ({
        textKey: 'Validate',
        onClick: ctx.actions.login.submit,
        icon: 'user',
        large: true,
      }),
    },

    {
      name: 'large buttonBorderRadius',
      props: ctx => ({
        textKey: 'Validate',
        onClick: ctx.actions.login.submit,
      }),
      theme: {
        buttonBorderRadius: '20px',
      },
    },

    {
      name: 'Link',
      props: ctx => ({
        textKey: 'Validate',
        onClick: ctx.actions.login.submit,
      }),
      component: Link,
    },
  ],
}

import * as React from 'react'
import { Recursive, RecursiveProps as Props } from '../..'
import { Comp, styled } from '../../app'
import { config, Stories } from '../helpers'

const Wrapper = styled.div`
  border: 1px solid orange;
  padding: 3px 8px;
`

const View: Comp<{ item: { title: string } }> = ({ item }) => {
  return <Wrapper>{item.title}</Wrapper>
}

const component = styled(Recursive)`
  width: 15rem;
  & .Sub {
    padding-top: 2px;
  }
`

export const recursiveStories: Stories<Props> = {
  name: 'Recursive',
  component,
  config,
  stories: [
    {
      name: 'simple',
      props: {
        item: { title: 'Foo' },
        getOpen(ctx, item) {
          return ctx.state.open[item.title]
        },
        setOpen(ctx, item, open) {
          ctx.actions.setOpen({ title: item.title, open })
        },
        getChildren(ctx, item) {
          if (item.title === 'Foo') {
            return ['Bar', 'Baz'].map(title => ({ title }))
          } else if (item.title == 'Baz') {
            return ['Babar', 'Papa'].map(title => ({ title }))
          }
          return undefined
        },
        View,
      },
      actions: {
        setOpen(ctx: any, arg: { title: string; open: boolean }) {
          ctx.state.open[arg.title] = arg.open
        },
      },
      state: {
        open: {
          Foo: true,
        },
      },
    },
  ],
}

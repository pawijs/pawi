import { Icon } from '@pawi/styled'
import * as React from 'react'
import { Comp, config, Stories, styled, useOvermind } from '../helper'

const Wrapper = styled.div`
  padding: 5px;
`

const OnlineWidget: Comp<{}> = () => {
  const ctx = useOvermind()
  const { online } = ctx.state.useragent
  const name = online ? 'Online' : 'Offline'
  return (
    <Wrapper>
      <Icon icon={name} className={name} />
      {name}
    </Wrapper>
  )
}

const MessageWidget: Comp<{}> = () => {
  const ctx = useOvermind()
  // The message is updated through a hook
  const { message } = ctx.state.test
  return <Wrapper>{message}</Wrapper>
}

export const simpleStories: Stories<{}> = {
  name: 'Show state',
  component: OnlineWidget,
  config,
  stories: [
    {
      name: 'state changes',
    },
  ],
}

export const hookStories: Stories<{}> = {
  name: 'Triggers hook',
  component: MessageWidget,
  config,
  stories: [
    {
      name: 'changes on hook',
    },
  ],
}

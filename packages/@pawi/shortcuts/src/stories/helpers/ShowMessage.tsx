import { Input, Message } from '@pawi/styled'
import * as React from 'react'
import { Comp, styled, useOvermind } from './'

export interface ShowMessageProps {
  className?: string
}

const Wrapper = styled.div`
  padding: 10px;
  font-size: 2rem;
  font-weight: bold;
`
export const ShowMessage: Comp<ShowMessageProps> = ({ className }) => {
  const app = useOvermind()
  return (
    <Wrapper className={className}>
      <Message text={app.state.test.message} />
      <Input name="message" form={app.state.test} />
    </Wrapper>
  )
}

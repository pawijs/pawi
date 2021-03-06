import randomParagraph from 'random-paragraph'
import * as React from 'react'
import { VTable } from '../..'
import { Comp, styled } from '../../app'
import { config, Stories } from '../helpers'

const Wrapper = styled.div`
  height: 800px;
  width: 100%;
`

const MWrapper = styled.div`
  border: 1px solid #333;
  margin: 1em 0.5em;
`

interface Item {
  title: string
}

const Message: Comp<{ item: Item }> = ({ item }) => {
  return <MWrapper>{item.title}</MWrapper>
}

const Test: Comp = () => {
  const list = Array.from({ length: 200 }).map(() => ({
    title: randomParagraph(),
  }))
  return <VTable list={list} component={Message} />
}

export const tableStories: Stories<{}> = {
  component: Test,
  config,
  wrapper: Wrapper,
  name: 'VTable',
  stories: [
    {
      name: 'simple',
    },
  ],
}

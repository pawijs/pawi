import * as React from 'react'
import { TreeType } from 'tuist'
import { Comp, styled } from '../../app'
import { Tree } from '../../components'
import { config, Stories, Wrapper } from '../helper'

export interface TwoTreesProps {
  className?: string
  branch1: TreeType
  branch2: TreeType
}

const MyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  & > div {
    margin: 20px;
  }
`

const TwoTrees: Comp<TwoTreesProps> = ({ branch1, branch2 }) => {
  return (
    <MyWrapper>
      <Tree tree={branch1} />
      <Tree tree={branch2} />
    </MyWrapper>
  )
}

export const treedrag: Stories<TwoTreesProps> = {
  name: 'Tree dragdrop',
  config,
  wrapper: Wrapper,
  stories: [
    {
      name: 'two for drag',
      component: TwoTrees,
      props: ctx => ({
        branch1: ctx.state.test.graph,
        branch2: ctx.state.test.graph2,
      }),
    },
  ],
}

import * as React from 'react'
import { styled } from '../../app'
import { InspectorIcon, InspectorWidget } from '../../components'
import { Inspectors } from '../../types'
import { TestApp } from './'

const Wrap = styled.div`
  padding: 8px;
`

const DummyDocument1 = (props: { className?: string }) => (
  <InspectorWidget className={props.className}>
    <Wrap>Document 1</Wrap>
  </InspectorWidget>
)
const DummyDocument2 = (props: { className?: string }) => (
  <InspectorWidget className={props.className}>
    <Wrap>Document 2</Wrap>
  </InspectorWidget>
)
const DummyNavigation1 = (props: { className?: string }) => (
  <InspectorWidget className={props.className}>
    <Wrap>Navigation 1 (exclusive)</Wrap>
  </InspectorWidget>
)
const DummyNavigation2 = (props: { className?: string }) => (
  <InspectorWidget className={props.className}>
    <Wrap>Navigation 2 (exclusive)</Wrap>
  </InspectorWidget>
)

const MyIcon = styled(InspectorIcon)`
  &.highlighted {
    color: orange;
  }
`

export const inspector: Inspectors = {
  navigation: {
    exclusive: true,
    children: {
      navigation1: {
        component: DummyNavigation1,
      },
      navigation2: {
        component: DummyNavigation2,
        iconComponent: MyIcon,
      },
    },
  },
  document: {
    enable(ctx: TestApp) {
      return ctx.state.test.hasDocument
    },
    children: {
      document1: {
        component: DummyDocument1,
      },
      // Shortcut when there is only a component.
      document2: DummyDocument2,
    },
  },
}

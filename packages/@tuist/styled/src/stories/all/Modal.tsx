import * as React from 'react'

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  Horizontal,
  ModalProps as Props,
  Spacer,
  TitleText,
  Modal as component,
} from '../..'
import { Stories, config, useOvermind } from '../helpers'

import { Comp } from '../../app'
import { ComponentWrapper } from '@tuist/story'
import { mutate } from 'overmind'

const Wrapper: Comp = ({ children }) => {
  const app = useOvermind()
  if (app.state.test.open) {
    return <ComponentWrapper>{children}</ComponentWrapper>
  }
  return null
}

export const modalStories: Stories<Props> = {
  component,
  config,
  wrapper: Wrapper,
  props: app => ({
    onClick: app.actions.test.toggleOpen,
  }),
  name: 'Modal (click to view)',
  titleClick: mutate(({ state }) => {
    state.test.open = !state.test.open
  }),
  stories: [
    {
      name: 'simple',
      children() {
        const app = useOvermind()
        return <Button onClick={app.actions.test.toggleOpen} text="Close" />
      },
    },

    {
      name: 'Modal with Card',
      children() {
        const app = useOvermind()
        return (
          <Card>
            <CardTitle titleKey="LoginTitle" key="t" />
            <CardContent>
              <TitleText>Something</TitleText>
            </CardContent>
            <CardFooter>
              <Horizontal>
                <Spacer />
                <Button onClick={app.actions.test.toggleOpen} text="Close" />
              </Horizontal>
            </CardFooter>
          </Card>
        )
      },
    },
  ],
}

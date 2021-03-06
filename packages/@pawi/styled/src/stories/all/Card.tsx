import * as React from 'react'
import {
  Button,
  Card as component,
  CardContent,
  CardFooter,
  CardProps as Props,
  CardTitle,
  Field,
  Horizontal,
  Message,
  Spacer,
  TitleText,
} from '../..'
import { styled } from '../../app'
import { config, Stories, useOvermind } from '../helpers'

const wrapper = styled.div`
  background: white;
  padding: 10px;
`

export const cardStories: Stories<Props> = {
  component,
  config,
  wrapper,
  name: 'Card with content',
  stories: [
    {
      name: 'simple',
      props: {},
      children: (
        <CardContent topBorder bottomBorder>
          <TitleText>Something</TitleText>
        </CardContent>
      ),
    },

    {
      name: 'medium',
      props: { medium: true },
      children: (
        <CardContent topBorder bottomBorder>
          <TitleText>Something</TitleText>
        </CardContent>
      ),
    },

    {
      name: 'large',
      props: { large: true },
      children: (
        <CardContent topBorder bottomBorder>
          <TitleText>Something</TitleText>
        </CardContent>
      ),
    },

    {
      name: 'shadow',
      props: { shadow: true },
      children: (
        <CardContent topBorder bottomBorder>
          <TitleText>Something</TitleText>
        </CardContent>
      ),
    },

    {
      name: 'content and footer',
      props: {},
      children: [
        // We have to add key as we are in an array. Not used normally.
        <CardContent topBorder key="c">
          <TitleText>Something</TitleText>
        </CardContent>,
        <CardFooter key="f">
          <TitleText>footer</TitleText>
        </CardFooter>,
      ],
    },

    {
      name: 'title, content and footer',
      props: {},
      children: [
        <CardTitle titleKey="Hello" key="t" />,
        <CardContent key="c">
          <TitleText>Something</TitleText>
        </CardContent>,
        <CardFooter key="f">
          <TitleText>footer</TitleText>
        </CardFooter>,
      ],
    },

    {
      name: 'title, content and footer shadow',
      props: { shadow: true },
      children: [
        <CardTitle titleKey="Hello" key="t" />,
        <CardContent key="c">
          <TitleText>Something</TitleText>
        </CardContent>,
        <CardFooter key="f">
          <TitleText>footer</TitleText>
        </CardFooter>,
      ],
    },

    {
      name: 'login',
      props: { medium: true, shadow: true },
      children: () => {
        const app = useOvermind()
        return [
          <CardTitle titleKey="LoginTitle" key="t" />,
          <CardContent key="c">
            <Message textKey="PleaseLogin" />
            <Field
              icon
              placeholder
              form={app.state.login}
              name="username"
              submit={app.actions.login.submit}
            />
            <Field
              icon
              placeholder
              form={app.state.login}
              name="password"
              type="password"
              submit={app.actions.login.submit}
            />
          </CardContent>,
          <CardFooter key="f">
            <Horizontal>
              <Spacer />
              <Button onClick={app.actions.login.cancel} text="Cancel" />
              <Button primary onClick={app.actions.login.submit} text="Login" />
            </Horizontal>
          </CardFooter>,
        ]
      },
    },
  ],
}

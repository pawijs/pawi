import * as React from 'react'
import {
  Page as component,
  PageContent,
  PageFooter,
  PageHeader,
  PageProps as Props,
} from '../..'
import { styled } from '../../app'
import { config, Stories } from '../helpers'

const MyFooter = styled(PageFooter)`
  background: #d8ebfd;
`

const MyHeader = styled(PageHeader)`
  background: #fdd8fd;
`

export const pageStories: Stories<Props> = {
  component,
  config,
  // wrapper,
  name: 'Page with content',
  theme: {
    pageWidth: '300px',
    pageHeaderHeight: '90px',
    pageFooterHeight: '90px',
    pageMarginLeftRight: '32px',
    pageMarginTopBottom: '32px',
  },
  stories: [
    {
      name: 'simple',
      children: [
        <PageHeader key="h">header</PageHeader>,
        <PageContent key="c">
          <p>
            A lot of stuff should go on this page. With enough text for us to
            view how it behaves near the footer.
          </p>
          <p>
            And some more stuff here, just to add to this pseudo page and wait
            until we have typed enough junk to fill such a small number of
            pixels.
          </p>
        </PageContent>,
        <PageFooter key="f">footer</PageFooter>,
      ],
    },
    {
      name: 'custom header and footer',
      children: [
        <MyHeader key="h">header</MyHeader>,
        <PageContent key="c">
          <p>
            A lot of stuff should go on this page. With enough text for us to
            view how it behaves near the footer.
          </p>
          <p>
            And some more stuff here, just to add to this pseudo page and wait
            until we have typed enough junk to fill such a small number of
            pixels.
          </p>
        </PageContent>,
        <MyFooter key="f">footer</MyFooter>,
      ],
    },
  ],
}

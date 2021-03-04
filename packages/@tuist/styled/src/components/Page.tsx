import * as React from 'react'
import { Comp, styled, theme } from '../app'

export interface PageProps {
  className?: string
}

interface DivProps {
  className?: string
  children?: React.ReactNode
}

export const Page = styled.div`
  background: ${theme.pageBackground};
  box-shadow: ${theme.pageBoxShadow};
  box-sizing: border-box;
  border-radius: 1px;
  /* We let it grow to avoid blink during pagination. */
  min-height: calc(${theme.pageRatio} * ${theme.pageWidth});
  color: #333;
  .Fullscreen & {
    box-shadow: none;
    margin: 0;
  }
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${theme.pageWidth};
  margin: ${theme.pageOuterMargin};
  @media print {
    & {
      margin: 0;
      background: white;
      box-shadow: none;
      /* make sure a tiny pixel difference does not break the whole pagination */
      height: calc(${theme.pageRatio} * ${theme.pageWidth});
      overflow: hidden;
      break-after: page;
    }
  }
`

const Parts = styled.div`
  box-sizing: border-box;
  width: ${theme.pageWidth};
  padding-left: ${theme.pageMarginLeftRight};
  padding-right: ${theme.pageMarginLeftRight};
`

const Header: Comp<DivProps> = ({ className, children }) => (
  <Parts className={className} contentEditable={false}>
    {children}
  </Parts>
)

export const PageHeader = styled(Header)`
  height: ${theme.pageHeaderHeight};
  padding-top: ${theme.pageMarginTopBottom};
  position: absolute;
  top: 0;
`

export const PageContent = styled(Parts)`
  padding-top: ${theme.pageHeaderHeight};
  padding-bottom: ${theme.pageFooterHeight};
  flex-grow: 1;
`

const Footer: Comp<DivProps> = ({ className, children }) => (
  <Parts className={className} contentEditable={false}>
    {children}
  </Parts>
)

export const PageFooter = styled(Footer)`
  bottom: 0;
  height: ${theme.pageFooterHeight};
  padding-bottom: ${theme.pageMarginTopBottom};
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
`

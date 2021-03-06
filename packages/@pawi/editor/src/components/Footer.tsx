import { PageFooter } from '@pawi/styled'
import * as React from 'react'
import { Comp, styled } from '../app'

interface FooterProps {
  page: number
  pageCount: number
  noPagination?: boolean
}

const TheFooter = styled(PageFooter)`
  display: flex;
  flex-direction: column-reverse;
`

const FooterContent = styled.div`
  color: #ccc;
  user-select: none;
  text-align: right;
`

// Default footer.
export const Footer: Comp<FooterProps> = function Footer({
  page,
  pageCount,
  noPagination,
}) {
  return (
    <TheFooter className="Footer" data-c="Footer">
      {noPagination ? null : (
        <FooterContent>
          {page} / {pageCount}
        </FooterContent>
      )}
    </TheFooter>
  )
}

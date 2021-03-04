import * as React from 'react'
import { Comp, styled, theme } from '../app'

const Wrapper = styled.div`
  @media not print {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    background: ${theme.modalBackground};
    backdrop-filter: ${theme.modalBackdropFilter};
  }
  z-index: 100;
`

const MyModal = styled.div`
  @media not print {
    position: relative;
    display: table;
    margin: ${theme.modalTopMargin} auto 0;
  }
  @media print {
    & {
      width: ${theme.pageWidth};
    }
  }
`

export interface ModalProps {
  children?: React.ReactNode
  className?: string
  // Sequence to run on background click (typically to close modal).
  onClick?: () => void
}

// We cannot test with open modal.
// istanbul ignore next
export const Modal: Comp<ModalProps> = ({ className, children, onClick }) => (
  <Wrapper className={className} onClick={onClick}>
    <MyModal className="Modal">{children}</MyModal>
  </Wrapper>
)

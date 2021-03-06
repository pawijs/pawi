import { styled } from '../app'

export const NoPrint = styled.div`
  @media print {
    visibility: hidden;
  }
`
NoPrint.displayName = 'NoPrint'

import { styled, theme } from '../app'
import { Icon } from './Icon'

// .nobg is needed to avoid ugly corners in Field with
// borderRadius.
// flex-box bug on windows without width: 0
export const BaseInput = styled.input`
  background: ${theme.inputBackground};
  border: none;
  color: ${theme.inputColor};
  display: flex;
  flex-grow: 1;
  font-size: ${theme.inputFontSize};
  line-height: ${theme.inputLineHeight};
  padding: ${theme.inputPadding};
  width: 0;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${theme.inputPlaceholderColor};
  }
`

export const ResetIcon = styled(Icon)`
  position: absolute;
  right: 0.2rem;
  color: ${theme.inputResetColor};
  &:hover {
    color: ${theme.inputResetColorHover};
  }
`

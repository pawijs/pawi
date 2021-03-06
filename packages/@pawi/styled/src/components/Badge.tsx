import { styled, theme } from '../app'

export const Badge = styled.span`
  display: inline-block;
  position: absolute;
  top: ${theme.badgeTop};
  right: ${theme.badgeRight};
  height: ${theme.badgeHeight};
  width: ${theme.badgeWidth};
  border: ${theme.badgeBorder};
  border-radius: ${theme.badgeBorderRadius};
  cursor: pointer;
  background: ${theme.badgeBackground};
  padding: 0;
  line-height: ${theme.badgeLineHeight};
  color: ${theme.badgeColor};
  font-size: ${theme.badgeFontSize};
  text-align: center;
  z-index: 1;
`

Badge.displayName = 'Badge'

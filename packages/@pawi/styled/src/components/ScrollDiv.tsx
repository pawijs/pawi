import { styled, theme } from '../app'

export const ScrollDiv = styled.div`
  overflow: auto;
  flex-grow: 1;
  &::-webkit-scrollbar-track {
    border-radius: ${theme.scrollBarRadius};
    border: ${theme.scrollTrackBorder};
    background-color: ${theme.scrollTrackBg};
  }

  &::-webkit-scrollbar {
    width: ${theme.scrollBarWidth};
    height: ${theme.scrollBarWidth};
    background-color: ${theme.scrollBarBg};
  }

  &::-webkit-scrollbar-corner {
    background-color: ${theme.scrollBarBg};
  }

  &::-webkit-scrollbar-thumb {
    border-radius: ${theme.scrollBarRadius};
    background-color: ${theme.scrollThumbBg};
  }
`

export const LargeScrollDiv = styled(ScrollDiv)`
  &::-webkit-scrollbar {
    width: ${theme.scrollBarLargeWidth};
    height: ${theme.scrollBarLargeWidth};
  }
`

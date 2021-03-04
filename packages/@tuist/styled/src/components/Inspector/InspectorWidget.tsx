import { styled, theme } from '../../app'
import { Resizable } from '../Resizable'

export const InspectorWidget = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  &.hidden {
    display: none;
  }
  div:not(.hidden) + &:not(.hidden) {
    border-left: ${theme.inspectorWidgetBorderLeft};
  }
  background: ${theme.inspectorWidgetBackground};
`

export const InspectorWidgetResize = styled(Resizable)`
  display: flex;
  flex-direction: column;
  &.hidden {
    display: none;
  }
  div:not(.hidden) + &:not(.hidden) {
    border-left: ${theme.inspectorWidgetBorderLeft};
  }
  background: ${theme.inspectorWidgetBackground};
`

import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../../app'
import { Icon } from '../Icon'

export interface InspectorIconProps {
  className?: string
  family: string
  child: string
  // Only open one child at a time.
  exclusive?: boolean
}

const MyIcon = styled(Icon)`
  color: inherit;
  &.highlighted {
    color: ${theme.inspectorIconHighColor};
  }
`

export const InspectorIcon: Comp<InspectorIconProps> = ({
  className,
  exclusive,
  family,
  child,
}) => {
  const { actions, state } = useOvermind()
  return (
    <MyIcon
      margin
      className={className}
      icon={child}
      tip
      onClick={() =>
        actions.styled.toggleChild({
          family,
          child,
          exclusive,
        })
      }
      highlighted={() => state.styled.show[family][child]}
    />
  )
}

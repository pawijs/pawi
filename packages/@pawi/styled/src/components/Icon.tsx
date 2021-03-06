import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { wrapTip } from './Tip'

export interface IconProps extends React.HTMLProps<HTMLSpanElement> {
  className?: string
  // The icon string to translate before passing it to
  // the actual icon rendering function.
  icon: string
  // If the value is trueish, the icon is higlighted (.highlighted class set).
  highlighted?: (() => any) | boolean
  // If true, the icon is 50% transparent and click is disabled.
  disabled?: boolean
  // If true will use icon name with 'On' appended when highlighted.
  // For example 'Folder', 'FolderOn', etc.
  hasOn?: boolean
  // Click handler when not using sequence.
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void
  // Used by controls to show that the value has been edited.
  changed?: boolean
  // Simple styling for large/medium variants. This should use theme.
  large?: boolean
  medium?: boolean
  noPrint?: boolean
  // Fontawesome
  style?: any
  spin?: boolean
  // Tooltip (tip is translated and is only showed if styled.showTips is true)
  // When true, it uses `tip${icon}Icon`
  tip?: string | boolean
  // Add 1rem margin to the left
  margin?: boolean
}

const IconComp: Comp<IconProps> = ({
  children,
  className,
  disabled,
  hasOn,
  highlighted,
  icon,
  large,
  medium,
  noPrint,
  onClick,
  spin,
  style,
  tip,
  margin,
  ...props
}) => {
  const { state } = useOvermind()
  const { IconComponent, icons } = state.styled.iconProvider()
  const isHigh =
    highlighted !== undefined && typeof highlighted === 'function'
      ? highlighted()
      : highlighted
  const iconName = hasOn && isHigh ? icon + 'On' : icon
  const click =
    onClick && !disabled
      ? (e: React.MouseEvent<HTMLSpanElement>) => {
          // We cannot preventDefault in case the caller forwards the
          // click (like on a input[type=file])
          e.stopPropagation()
          onClick(e)
        }
      : undefined
  return wrapTip(
    tip,
    icon,
    'Icon',
    <IconComponent
      fixedWidth
      spin={spin}
      icon={iconName}
      icons={icons}
      className={classnames(
        {
          highlighted: isHigh,
          disabled,
          margin,
          large,
          medium,
          noPrint,
          hasClick: onClick || props.onMouseDown,
        },
        'Icon',
        className
      )}
      onClick={click}
      style={style}
      {...props}
    >
      {children}
    </IconComponent>
  )
}

export const Icon = styled(IconComp)`
  position: relative;
  flex-shrink: 0;
  &.noPrint {
    @media print {
      visibility: hidden;
    }
  }
  &.margin:not(:first-child) {
    margin-left: 1rem;
  }
  &.large {
    font-size: ${theme.iconLargeFontSize};
  }
  &.medium {
    font-size: ${theme.iconMediumFontSize};
  }
  &.hasClick {
    cursor: pointer;
    &:active {
      transform: translateY(0.5px);
      transition-duration: 0.1s;
    }
  }
  &.disabled {
    opacity: ${theme.iconDisabledOpacity};
  }
  &:focus {
    outline: none;
  }
`

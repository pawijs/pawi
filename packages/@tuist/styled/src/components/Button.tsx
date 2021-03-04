import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { Icon } from './Icon'
import { wrapTip } from './Tip'

export interface ButtonProps {
  large?: boolean
  primary?: boolean
  className?: string
  disabled?: boolean
  icon?: string | boolean
  // Untranslated text.
  text?: string
  // Translated text.
  textKey?: string
  onClick: (e: React.MouseEvent) => void
  // Tooltip. When 'true', uses `tip${textKey}Button`. Cannot be true without textKey
  tip?: string | boolean
}

const Btn: Comp<ButtonProps> = ({
  children,
  className,
  disabled,
  tip,
  icon,
  onClick,
  text,
  textKey,
  large,
  primary,
}) => {
  const { state } = useOvermind()
  const translate = state.locale.translate
  if (icon === true && !textKey) {
    throw new Error(
      `Button icon set to true but 'textKey' is blank. Set icon to a string or use textKey.`
    )
  }
  if (tip === true && !textKey) {
    throw new Error(
      `Button tip set to true but 'textKey' is blank. Set tip to a string or use textKey.`
    )
  }
  return wrapTip(
    tip,
    textKey!,
    'Button',
    <button
      className={classnames(
        { primary, disabled, large, icon: icon !== undefined },
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      {icon ? (
        <Icon
          icon={typeof icon === 'string' ? icon : textKey || ''}
          large={large}
        />
      ) : (
        ''
      )}
      <span>
        {text ? text : textKey ? translate(textKey) : null}
        {children}
      </span>
    </button>
  )
}

export const Link = styled(Btn)`
  display: flex;
  position: relative;
  margin: ${theme.buttonMargin};
  margin-left: 0;
  align-items: center;
  justify-content: space-around;
  background: none;
  border: none;
  outline: none;
  font-size: inherit;
  text-align: left;
  text-decoration: underline;
  text-align: center;
  /* extra classes */
  &:not(.disabled) {
    cursor: pointer;
  }
  &.disabled {
    opacity: 0.3;
  }
  &.icon {
    padding-left: 0;
  }
`

export const Button = styled(Btn)`
  text-align: left;
  background: ${theme.buttonBackground};
  border: none;
  border-radius: ${theme.buttonBorderRadius};
  color: ${theme.buttonColor};
  &:not(.disabled) {
    cursor: pointer;
  }
  font-size: inherit;
  margin: ${theme.buttonMargin};
  margin-left: 0;
  outline: none;
  text-align: center;
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  align-self: center;
  min-width: ${theme.buttonWidth};
  padding: ${theme.buttonPadding};
  /* extra classes */
  &.primary {
    background: ${theme.buttonPrimaryBackground};
    color: ${theme.buttonPrimaryColor};
  }
  &.disabled {
    opacity: 0.3;
  }
  &.large {
    min-width: ${theme.buttonLargeWidth};
    padding: ${theme.buttonLargePadding};
  }
  &.icon {
    padding-left: 0;
  }
  &:not(.disabled):not(.primary):hover {
    background: ${theme.buttonHoverBackground};
  }
  &:not(.disabled).primary:hover {
    background: ${theme.buttonPrimaryHoverBackground};
  }
  &:not(.primary):not(.disabled):active {
    background: ${theme.buttonActiveBackground};
    top: 1px;
  }
  &:not(.disabled).primary:active {
    background: ${theme.buttonPrimaryActiveBackground};
    top: 1px;
  }
`

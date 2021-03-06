import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { Icon } from './Icon'
import { Input, InputProps } from './Input'

const FieldIcon = styled.div`
  display: flex;
  align-items: center;
  border-top-left-radius: ${theme.fieldBorderRadius};
  border-bottom-left-radius: ${theme.fieldBorderRadius};
  background: ${theme.fieldIconBackground};
  justify-content: center;
  border-right: ${theme.fieldBorder};
  line-height: ${theme.inputLineHeight};
  padding: 0.1rem;
`

const TheIcon = styled(Icon)`
  font-size: ${theme.inputFontSize};
  line-height: 1rem;
  padding: ${theme.fieldIconPadding};
  margin: 0;
`

const TheInput = styled(Input)`
  & input {
    flex: 1;
    background: transparent;
  }
`

// This breaks forms with text fields.
// Why did we need it ?
// align-self: center;
const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  margin: ${theme.fieldMargin};
  margin-bottom: 0;
  border: ${theme.fieldBorder};
  border-radius: ${theme.fieldBorderRadius};
  box-sizing: border-box;
  background: ${theme.inputBackground};
  line-height: ${theme.inputLineHeight};
  &.Checkbox {
    cursor: pointer;
    flex-grow: 0;
  }
  &.Select .Select {
    flex-grow: 1;
  }
  &.Checkbox .Checkbox {
    padding: 5px 12px;
    align-self: center;
  }
  &.Checkbox.hasValue {
    background: ${theme.fieldCheckedBackground};
  }
  &.disabled:not(.info) {
    opacity: 0.3;
  }
  &.info {
    color: ${theme.fieldInfoColor};
    background: ${theme.fieldInfoBackground};
    border: ${theme.fieldInfoBorder};
    input {
      color: ${theme.fieldInfoInputColor};
      font-weight: ${theme.fieldInfoInputFontWeight};
    }
  }
`

export interface FieldProps extends InputProps {
  // Display an icon with the given name
  icon?: string | boolean
  info?: boolean
}

export const Field: Comp<FieldProps> = function Field({
  info,
  icon,
  className,
  disabled: disabledProp,
  ...props
}) {
  // Track
  useOvermind()

  let iconName = ''
  if (icon === true) {
    iconName = props.name
  } else if (icon) {
    iconName = icon
  }

  const disabled = disabledProp || info

  return (
    <Wrapper
      className={classnames(className, {
        Checkbox: props.type === 'checkbox',
        Select: props.type === 'select',
        hasValue: !!props.form[props.name],
        disabled,
        info,
      })}
    >
      {icon && (
        <FieldIcon>
          <TheIcon icon={iconName} />
        </FieldIcon>
      )}
      <TheInput {...props} disabled={disabled} className="nobg" />
    </Wrapper>
  )
}

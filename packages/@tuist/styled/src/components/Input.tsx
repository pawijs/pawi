import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { Icon } from './Icon'
import { wrapTip } from './Tip'
import { ResetIcon, BaseInput } from './CommonStyles'
import { Select } from './Select'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

const MySelect = styled(Select)`
  margin: 5px 15px;
`

export interface InputProps
  extends Omit<
    React.HTMLProps<HTMLInputElement>,
    'form' | 'placeholder' | 'onChange' | 'ref' | 'as'
  > {
  // Styling
  className?: string
  // Do not allow edit.
  disabled?: boolean
  // Form. Example: state.forms.login
  form: { [key: string]: any }
  // Name of the field in the form
  name: string
  // If placeholder is true, we translate [name]Placeholder
  // and show this as placeholder
  placeholder?: string | boolean
  // Autofocus on mount
  autoFocus?: boolean
  // Select all on focus
  autoSelect?: boolean
  // Show a reset button with input field to restore value to a blank string.
  reset?: boolean
  // Icon to show for the reset button (default to ResetField)
  resetIcon?: string
  // Action to do on reset (default to setting value to '')
  onReset?: () => void
  // Action to do on reset (default to setting value to '')
  onChange?: (arg: {
    form: { [key: string]: any }
    name: string
    value: any
  }) => void
  // TODO: Replace with onSubmit...
  submit?: () => void
  // Type for input element (password, etc).
  type?: string
  // Tooltip. If 'true', uses `tip${name}Input`
  tip?: string | boolean
  // Change value before save
  parse?: (value: string) => string | number
  // For select input
  options?: { key: string; value: string }[]
  includeBlank?: boolean
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
  &.reset input {
    padding-right: 1.5rem;
  }
  &.nobg input {
    background: transparent;
  }
  &.Checkbox:not(.disabled) {
    cursor: pointer;
  }
  &.Checkbox {
    line-height: normal;
    display: flex;
    align-items: center;
  }
  &.Checkbox .text {
    margin: ${theme.iconMargin};
    margin-left: 0;
    font-weight: bold;
  }
`

const CheckIcon = styled(Icon)``

export const Input: Comp<InputProps> = ({
  autoFocus,
  className,
  disabled,
  form,
  name,
  tip,
  onChange: changeCallback,
  onReset,
  placeholder,
  reset,
  resetIcon,
  submit,
  type,
  parse,
  onClick,
  checked,
  autoSelect,
  options,
  includeBlank,
  ...props
}) => {
  const app = useOvermind()
  const changed = changeCallback || app.actions.styled.valueChanged
  const translate = app.state.locale.translate

  const placeholderName =
    placeholder === true ? `${name}Placeholder` : placeholder
  const value = form[name]

  // istanbul ignore next
  function onChange(e: React.FormEvent<HTMLInputElement>) {
    changed({
      value: parse ? parse(e.currentTarget.value) : e.currentTarget.value,
      form,
      name,
    })
  }

  // istanbul ignore next
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (submit && e.key === 'Enter') {
      submit()
    } else if (e.key === 'Escape') {
      changed({
        value: '',
        form,
        name,
      })
    }
  }
  if (type === 'checkbox') {
    const value = checked !== undefined ? checked : !!form[name]
    return wrapTip(
      tip,
      name,
      'Checkbox',
      <span
        className={classnames(className, 'Checkbox', {
          checked: value,
          disabled,
        })}
        onClick={
          // istanbul ignore next
          disabled
            ? undefined
            : onClick || (() => changed({ form, name, value: !value }))
        }
      >
        <CheckIcon icon={value ? 'CheckboxOn' : 'CheckboxOff'} />
        <span className="text">
          {app.state.locale.translate(`${name}Checkbox`)}
        </span>
      </span>
    )
  } else if (type === 'select') {
    return (
      <MySelect
        className={className}
        form={form}
        name={name}
        options={options}
        includeBlank={includeBlank}
      />
    )
  }

  const field = (
    <BaseInput
      autoComplete="off"
      autoFocus={autoFocus}
      disabled={disabled}
      name={name}
      onChange={onChange}
      onClick={onClick}
      onKeyDown={onKeyDown}
      placeholder={placeholderName ? translate(placeholderName) : ''}
      type={type}
      value={value || ''}
      onFocus={autoSelect ? e => e.target.select() : undefined}
      {...props}
    />
  )

  return wrapTip(
    tip,
    name,
    'Input',
    <Wrapper className={classnames(className, { reset })}>
      {field}
      {reset && value ? (
        <ResetIcon
          className="reset"
          icon={resetIcon || 'ResetField'}
          onClick={
            // istanbul ignore next
            onReset || (() => changed({ form, name, value: '' }))
          }
        />
      ) : null}
    </Wrapper>
  )
}

export const RoundInput = styled(Input)`
  & input {
    flex-grow: 1;
    border-radius: ${theme.roundInputBorderRadius};
    padding: ${theme.roundInputPadding};
    background: ${theme.roundInputBackground};
  }
  & .reset {
    top: ${theme.roundInputResetTop};
    right: ${theme.roundInputResetRight};
    color: ${theme.roundInputResetColor};
  }
  &.light input {
    background: ${theme.roundInputLightBackground};
  }
`

RoundInput.displayName = 'RoundInput'

import * as React from 'react'
import { Comp, theme, styled, useOvermind } from '../app'
import { BaseInput } from './CommonStyles'
import { wrapTip } from './Tip'
import { Spacer } from './Spacer'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface PlusMinusInputProps
  extends Omit<
      React.HTMLProps<HTMLInputElement>,
      'form' | 'placeholder' | 'onChange' | 'ref' | 'as'
    > {
  // Styling
  className?: string
  // Do not allow edit.
  disabled?: boolean
  value: number
  min: number
  step: number
  max: number
  // Name of the field in the form
  name: string
  onChange: (arg: { name: string; value: number }) => void
  // Tooltip. If 'true', uses `tip${name}Input`
  tip?: string | boolean
  autoSelect?: boolean
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
  align-items: center;
  & input {
    border-radius: 4px;
    max-width: 6rem;
    border: 1px solid #aaa;
    text-align: center;
    line-height: 1.4rem;
    font-size: 0.9rem;
  }
  &.reset input {
    padding-right: 1.5rem;
  }
  &.nobg input {
    background: transparent;
  }
`

const Btn = styled.span`
  cursor: pointer;
  margin: 0 5px;
  padding: 2px 6px;
  font-size: 0.9rem;
  background: ${theme.buttonBackground};
  border-radius: 2px;
  border: 1px solid #aaa;
`

export const PlusMinusInput: Comp<PlusMinusInputProps> = ({
  autoFocus,
  className,
  disabled,
  name,
  tip,
  onChange,
  max,
  min,
  step,
  value,
  autoSelect,
  ...props
}) => {
  useOvermind()
  function change(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseInt(e.currentTarget.value)
    const value = Math.max(min, Math.max(min, v))
    onChange({
      value,
      name,
    })
  }

  function stepValue(delta: number) {
    const v = Math.max(min, Math.max(min, value + delta))
    onChange({
      value: v,
      name,
    })
  }

  return wrapTip(
    tip,
    name,
    'Input',
    <Wrapper className={className}>
      <Spacer />
      <Btn className="Step" onClick={() => stepValue(-step || -1)}>
        -
      </Btn>
      <BaseInput
        autoComplete="off"
        autoFocus={autoFocus}
        disabled={disabled}
        name={name}
        onChange={change}
        type="text"
        value={value}
        onFocus={autoSelect ? e => e.target.select() : undefined}
        {...props}
      />
      <Btn className="Step" onClick={() => stepValue(step || 1)}>
        +
      </Btn>
      <Spacer />
    </Wrapper>
  )
}

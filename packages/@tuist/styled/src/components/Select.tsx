import * as React from 'react'
import classnames from 'classnames'
import { useState } from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { wrapTip } from './Tip'

const MOVED_DIST = 10

function dist(
  start: { x: number; y: number },
  ev: React.MouseEvent<HTMLSpanElement>
): number {
  const dx = ev.clientX - start.x
  const dy = ev.clientY - start.y
  return Math.sqrt(dx * dx + dy * dy)
}

export interface SelectProps {
  // Styling
  className?: string
  // State tag to form value
  form: { [key: string]: any }
  // The key of the value in form
  name: string
  // A method to trigger on value change instead of directly
  // changing state value.
  onChange?: (key: string) => void
  // Array of keys to be used as options, the keys are translated.
  keys?: string[]
  // Direct key/value pairs.
  options?: { key: string; value: string }[]
  // Open select on mount
  autoFocus?: boolean
  // When value is selected: show key instead of value
  showKey?: boolean
  // Add blank option
  includeBlank?: boolean
  // Tooltip. if 'true', uses `tip${name}Select`
  tip?: string | boolean
}

const Wrapper = styled.div`
  user-select: none;
  cursor: pointer;
  position: relative;
  margin: ${theme.selectMargin};
  &:focus {
    outline: none;
  }
  &.blank {
    opacity: 0.8;
    font-style: italic;
  }
`

const OptionList = styled.div`
  position: fixed;
  opacity: 0.9;
  overflow: hidden;
  transform: translate(-0.5rem, -1.5rem);
  display: flex;
  flex-direction: column;
  color: ${theme.cardColor};
  background: ${theme.cardBackground};
  border-radius: 3px;
  border: ${theme.cardBorder};
  box-shadow: ${theme.cardBoxShadow};
  z-index: 99;
  &.moved .selected {
    color: ${theme.optionColor};
    background: ${theme.optionPreviousSelectedBackground};
  }
  &.moved .selected:hover {
    color: ${theme.optionHoverColor};
    background: ${theme.optionHoverBackground};
  }
  & .blank {
    opacity: 0.8;
    font-style: italic;
  }
`

export const Option = styled.div`
  user-select: none;
  padding: ${theme.optionPadding};
  color: ${theme.optionColor};
  background: ${theme.optionBackground};
  &.selected {
    color: ${theme.optionSelectedColor};
    background: ${theme.optionSelectedBackground};
  }
  &:hover {
    color: ${theme.optionHoverColor};
    background: ${theme.optionHoverBackground};
  }
  border-bottom: 1px solid #ccc;
  &:last-child {
    border-bottom: none;
  }
`

export const Select: Comp<SelectProps> = ({
  autoFocus,
  className,
  tip,
  form,
  keys,
  name,
  options: theOptions,
  onChange,
  showKey,
  includeBlank,
}) => {
  const ctx = useOvermind()
  const [open, setOpen] = useState(autoFocus ? true : false)
  const [moved, setMoved] = useState(false)
  const translate = ctx.state.locale.translate
  const selected = form[name]
  let options = theOptions
    ? theOptions
    : keys
    ? keys.map(key => ({ key, value: translate(key) }))
    : undefined

  if (!options) {
    throw new Error(
      `Invalid Select props. You need one of 'keys' or 'options'.`
    )
  }

  if (includeBlank) {
    options = [{ key: undefined as any, value: '--' }, ...options]
  }

  const value = showKey
    ? selected
    : (options.find(opt => opt.key === selected) || options[0] || {}).value

  if (open) {
    let startPosition: { x: number; y: number } | undefined
    return (
      <Wrapper className={className}>
        {value}
        <OptionList
          className={'moved'}
          onMouseMove={e => {
            if (!startPosition) {
              startPosition = {
                x: e.clientX,
                y: e.clientY,
              }
            } else if (dist(startPosition, e) > MOVED_DIST) {
              setMoved(true)
            }
          }}
          onMouseLeave={() => {
            setMoved(false)
            setOpen(false)
          }}
        >
          {options.map(opt => (
            <Option
              key={opt.key || '--'}
              className={classnames({
                selected: opt.key === selected,
                blank: opt.key === undefined,
              })}
              onMouseUp={() => {
                if (!moved) {
                  setMoved(true)
                  return
                }
                if (onChange) {
                  onChange(opt.key)
                } else {
                  ctx.actions.styled.valueChanged({
                    form,
                    name,
                    value: opt.key,
                  })
                }
                setOpen(false)
                setMoved(false)
              }}
            >
              {opt.value}
            </Option>
          ))}
        </OptionList>
      </Wrapper>
    )
  } else {
    return wrapTip(
      tip,
      name,
      'Select',
      <Wrapper
        className={classnames(
          {
            blank: selected === undefined,
            Select: true,
          },
          className
        )}
        onMouseDown={e => {
          if (e.button === 0) {
            // only regular click opens select
            setOpen(true)
          }
        }}
      >
        {value}
      </Wrapper>
    )
  }
}

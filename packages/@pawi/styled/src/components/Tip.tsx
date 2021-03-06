import Tippy, { TippyProps } from '@tippyjs/react'
import * as React from 'react'
import { useOvermind } from '../app'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface TipProps extends Omit<TippyProps, 'content'> {
  content?: React.ReactChild | React.ReactChild[]
  tip: string
}

export function wrapTip(
  tip: boolean | string | undefined,
  name: string,
  type: string,
  content: JSX.Element
) {
  if (!tip) {
    return content
  } else if (tip === true) {
    return <Tip tip={`tip${name}${type}`}>{content}</Tip>
  } else {
    return <Tip tip={tip}>{content}</Tip>
  }
}

// Tippy is really problematic during testing so we simply
// return a different object. Other solutions imply modifying
// every jest setup that uses '@pawi/styled' and this
// is not a solution for something as trivial as tooltips.
// Sad but true.
let TipImpl = function Tip({ disabled, content, tip, ...props }: TipProps) {
  return props.children || null
}

if (process.env.NODE_ENV !== 'test') {
  require('tippy.js/dist/tippy.css')
  TipImpl = function Tip({ disabled, content, tip, ...props }: TipProps) {
    const ctx = useOvermind()
    if (disabled || !ctx.state.styled.showTips) {
      return props.children || null
    }
    return (
      <Tippy
        content={content || ctx.state.locale.translate(tip)}
        delay={300}
        animation="fade"
        {...props}
      />
    )
  }
}

export const Tip = TipImpl

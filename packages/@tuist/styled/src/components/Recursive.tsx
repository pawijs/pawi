import * as React from 'react'

import { Comp, styled, useOvermind } from '../app'

import { Icon } from './Icon'
import classnames from 'classnames'

export interface RecursiveOptions<C = any, T = any> {}

export interface RecursiveProps<C = any, T = any, VP = any> {
  className?: string
  // Always display caret icon even without children
  caretIcon?: 'always'
  item?: T
  name?: string
  View: Comp<{ item: T } & VP>
  viewProps?: VP
  getChildren: (ctx: C, item: T) => T[] | undefined | void
  getOpen: (ctx: C, item: T) => boolean
  setOpen: (ctx: C, item: T, open: boolean) => void
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`
const Sub = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

export const Recursive: Comp<RecursiveProps> = ({
  item,
  className,
  View,
  ...options
}) => {
  if (!item) {
    return null
  }
  const ctx = useOvermind()
  const subItems = options.getChildren(ctx, item)
  const hasSub = subItems && subItems.length
  const open = options.getOpen(ctx, item)
  if (!open && !hasSub && options.caretIcon !== 'always') {
    // Just display view
    return <View item={item} {...(options.viewProps || {})} />
  }
  return (
    <Wrapper
      className={classnames(
        {
          hasSub,
          noSub: !hasSub,
          open,
          closed: !open,
        },
        className
      )}
    >
      {hasSub || options.caretIcon === 'always' ? (
        <Icon
          icon={`${options.name || 'Recursive'}${
            hasSub ? (open ? 'Open' : 'Close') : ''
          }`}
          onClick={() => options.setOpen(ctx, item, !open)}
        />
      ) : null}
      <Sub className="Sub">
        <View item={item} {...(options.viewProps || {})} />
        {open &&
          subItems &&
          subItems.map((item, idx) => (
            <Recursive key={idx} item={item} View={View} {...options} />
          ))}
      </Sub>
    </Wrapper>
  )
}

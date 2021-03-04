import classnames from 'classnames'
import * as React from 'react'
import { Comp, useOvermind } from '../app'

export interface ChildrenProps {
  className?: string
  family: string | { [key: string]: boolean }
  // If true, this uses React.Fragment instead of 'div' to wrap children.
  // Only works with a single group.
  noTag?: boolean
  [key: string]: any
}

export const Children: Comp<ChildrenProps> = ({
  family,
  className,
  noTag,
  ...passedProps
}) => {
  const ctx = useOvermind()
  const allFamilies = ctx.state.styled.familyComponents()
  const families =
    typeof family === 'string'
      ? [family]
      : Object.keys(family).filter(k => family[k])
  const groups: { [key: string]: JSX.Element[] } = {}
  families.forEach((family, fidx) => {
    const children = allFamilies[family]
    if (!children) {
      console.log(allFamilies)
      throw new Error(
        `Invalid family name '${family}' (no settings for this name).`
      )
    }
    Object.keys(children).forEach((child, idx) => {
      const { component: Comp, props, enable, visible, group } = children[child]
      const theProps = Object.assign(
        {},
        typeof props === 'function' ? props(ctx) : Object.assign({}, props),
        passedProps
      )
      const enabled = enable
        ? enable(ctx, { family, child, props: theProps })
        : true
      let className =
        visible && !visible(ctx, { family, child, props: theProps })
          ? `hidden ${child}`
          : child
      if (enabled) {
        if (!groups[group]) {
          groups[group] = []
        }
        groups[group].push(
          <Comp className={className} key={fidx + idx} {...theProps} />
        )
      }
    })
  })
  const groupNames = Object.keys(groups)
  if (!groupNames.length) {
    return null
  }
  if (groupNames.length === 1) {
    return noTag ? (
      <React.Fragment children={groups[groupNames[0]]} />
    ) : (
      <div
        className={classnames(className, family, groupNames[0])}
        children={groups[groupNames[0]]}
      />
    )
  } else {
    return (
      <div className={classnames(className, 'Groups')}>
        {groupNames.map(row => (
          <div key={row} className={classnames('Group', row)}>
            {groups[row]}
          </div>
        ))}
      </div>
    )
  }
}

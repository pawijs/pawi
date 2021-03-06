import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'
import { stringifyComponent } from '../helpers/stringifyComponent'

function limit(text: string, length: number) {
  const lines = text.split('\n')
  const line = lines[0]
  if (line.length <= length && lines.length === 1) {
    return line
  } else {
    return line.slice(0, length) + '...'
  }
}

interface CodeProps {
  props: Function | { [key: string]: any }
  component: any
  className?: string
  jsx?: string
}

const Wrapper = styled.div`
  background: #e2e2e2;
  color: #555;
  padding: 10px;
  border-right: 1px solid #aaa;
  font-size: 0.8rem;
  white-space: pre;
  position: relative;
  width: 15rem;
  & .jsx {
    border: 1px solid #aaa;
    background: #f5f4de;
    position: absolute;
    padding: 10px;
    top: -1px;
    left: -1px;
    opacity: 0;
    transition-property: opacity;
    transition-duration: 0.1s;
    transition-delay: 0.8s;
    z-index: 99;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
    visibility: hidden;
    min-width: 15rem;
  }
  &:hover .jsx {
    visibility: visible;
    opacity: 1;
  }
`

export const ComponentCode: Comp<CodeProps> = ({
  props,
  children,
  component,
  className,
  jsx,
}) => {
  const app = useOvermind()
  const theProps = typeof props === 'function' ? props(app) : props
  return (
    <Wrapper className={className}>
      {limit(
        jsx || stringifyComponent(component, { ...theProps, children }),
        30
      )}
      <div className="jsx">
        {jsx || stringifyComponent(component, { ...theProps, children })}
      </div>
    </Wrapper>
  )
}

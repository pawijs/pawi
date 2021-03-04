import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'

export interface ResizeArg {
  height?: number
  width?: number
}

export interface ResizableProps {
  className?: string
  // This is to use default storage & handlers
  type?: 'width' | 'height' | 'both' | 'none'
  name?: string
  // This is for hand made handling or default value
  width?: number
  defaultWidth?: number
  minWidth?: number
  height?: number
  defaultHeight?: number
  minHeight?: number
  step?: number
  top?: boolean
  onResize?: (arg: ResizeArg) => void
}

/* the grow: 0 is important to avoid confusion */
const Wrapper = styled.div`
  position: relative;
  &&.fixed {
    flex-grow: 0;
  }
`

// background: ${theme.resizeHandleBackground};
const Handle = styled.div`
  touch-action: none;
  border-top-left-radius: 3px;
  border: ${theme.resizeHandleBorder};
  &.width {
    cursor: col-resize;
    width: 8px;
    height: 22px;
  }
  &.height {
    cursor: row-resize;
    width: 22px;
    height: 8px;
  }
  &.width.height {
    cursor: nwse-resize;
    width: 14px;
    height: 14px;
  }
  &:not(.top) {
    bottom: 0;
  }
  &.top {
    top: 0;
  }
  right: 0;
  position: absolute;
`

const HandleBg = styled.div`
  background: ${theme.resizeHandleBackground};
  border-top-left-radius: 3px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
`

const DEFAULT_SIZE = 288

export const Resizable: Comp<ResizableProps> = ({
  className,
  children,
  type,
  name,
  width,
  defaultWidth,
  minWidth,
  height,
  defaultHeight,
  minHeight,
  top,
  step,
  onResize,
}) => {
  const [loc, setLoc] = React.useState({ width: 0, height: 0 })
  const ctx = useOvermind()
  if (name) {
    const size = ctx.state.styled.sizes[name] || {}
    if (type === 'width') {
      // width argument is used as default
      width = size.width || defaultWidth || DEFAULT_SIZE
    } else if (type === 'height') {
      // height argument is used as default
      height = size.height || defaultHeight || DEFAULT_SIZE
    } else if (type === 'both') {
      width = size.width || defaultWidth || DEFAULT_SIZE
      height = size.height || defaultHeight || DEFAULT_SIZE
    } else {
      // none
    }
  }
  if (!onResize) {
    if (!name) {
      return <div>Cannot render Resizable without onResize or name.</div>
    }
    onResize = (value: ResizeArg) => ctx.actions.styled.resize({ name, value })
  }
  return (
    <Wrapper
      className={classnames(className, { fixed: type !== 'none' })}
      style={{
        width: width ? Math.max(width, minWidth || 8) : width,
        height: height ? Math.max(height, minHeight || 8) : height,
      }}
    >
      {children}
      {type !== 'none' && (
        <Handle
          className={classnames('Handle', { width, height, top })}
          contentEditable={false}
          onPointerDown={e => {
            setLoc({
              width: width ? e.clientX - width : 0,
              height: height ? e.clientY - height : 0,
            })
            e.currentTarget.setPointerCapture(e.pointerId)
          }}
          onPointerUp={e => {
            setLoc({ width: 0, height: 0 })
            const target = e.currentTarget
            target.releasePointerCapture(e.pointerId)
          }}
          onPointerMove={e => {
            e.preventDefault()
            const parent = e.currentTarget.parentElement
            const arg: ResizeArg = {}
            if (loc.width) {
              arg.width = Math.max(e.clientX - loc.width, minWidth || 0)
              if (step) {
                arg.width = Math.floor(0.5 + arg.width / step) * step
              }
              parent!.style.width = arg.width + 'px'
            }
            if (loc.height) {
              arg.height = Math.max(e.clientY - loc.height, minHeight || 0)
              if (step) {
                arg.height = Math.floor(0.5 + arg.height / step) * step
              }
              parent!.style.height = arg.height + 'px'
            }
            onResize!(arg)
          }}
        >
          <HandleBg />
        </Handle>
      )}
    </Wrapper>
  )
}

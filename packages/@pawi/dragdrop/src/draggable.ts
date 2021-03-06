import { Context } from './app'
import { droppable } from './droppable'
import { DragdropHooks, DraggableHooks, DroppableSettings } from './types'

const DRAG_DELTA = 10

function dist(
  start: { x: number; y: number },
  ev: React.MouseEvent<HTMLSpanElement>
): number {
  const dx = ev.clientX - start.x
  const dy = ev.clientY - start.y
  return Math.sqrt(dx * dx + dy * dy)
}

export interface DraggableSettings<T = any> {
  drag: string
  // Setting className is only needed when an item is both draggable and droppable.
  className?: string
  hooks?: DragdropHooks
  payload: T
  // Normal click.
  onClick?: (e: React.MouseEvent<any>) => void
  // Defaults to `true`. Value must be `false` to disable dragging.
  enable?: boolean
}

export function makeDragdropHooks<T = any, U = any>(
  ctx: { state: Context['state']; actions: Context['actions'] },
  settings: DraggableSettings<T>,
  // This can be used when we want both drag and drop operations on the
  // same kind of elements
  dropSettings?: DroppableSettings<U>
): Partial<DraggableHooks> {
  const dragging = ctx.state.dragdrop.drag
  const start = ctx.actions.dragdrop.start
  const dragMove = ctx.actions.dragdrop.move
  const dragEnd = ctx.actions.dragdrop.release
  const { className, drag, payload, enable, onClick } = settings

  if (dragging) {
    // Cannot drag another element: all hooks are noop
    return dropSettings
      ? droppable(ctx, dropSettings)
      : className
        ? { className, onClick }
        : { onClick }
  }

  if (enable === false) {
    return { onClick }
  }
  let down = false
  let startPosition: { x: number; y: number } | undefined
  function startDrag(e: React.MouseEvent<HTMLSpanElement>, force: boolean) {
    e.preventDefault()
    const delta = startPosition ? dist(startPosition, e) : 0
    if (startPosition && (delta > DRAG_DELTA || force)) {
      const target = e.target as HTMLSpanElement
      const targetPos = target.getBoundingClientRect()
      const anchor = {
        x: startPosition.x - targetPos.left,
        y: startPosition.y - targetPos.top,
      }
      start({
        drag: {
          anchor,
          type: drag,
          payload,
        },
        position: { x: e.clientX, y: e.clientY },
      })

      function mouseMove(e: MouseEvent) {
        e.preventDefault()
        dragMove({ position: { x: e.clientX, y: e.clientY } })
      }

      function mouseUp(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        document.body.style.cursor = 'default'
        window.removeEventListener('mousemove', mouseMove)
        window.removeEventListener('mouseup', mouseUp)
        dragEnd()
      }

      document.body.style.cursor = '-webkit-grabbing'
      window.addEventListener('mousemove', mouseMove)
      window.addEventListener('mouseup', mouseUp)
    }
  }

  const retProps: Partial<DraggableHooks> = {
    onMouseLeave(e: any) {
      if (down) {
        startDrag(e, true)
      } else {
        startPosition = undefined
      }
    },
    onMouseUp(e: React.MouseEvent<any>) {
      if (e.button !== 0) {
        return
      }
      down = false
      startPosition = undefined
      if (onClick) {
        onClick(e)
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseDown(e: React.MouseEvent<any>) {
      if (e.button !== 0) {
        return
      }
      down = true
      startPosition = { x: e.clientX, y: e.clientY }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseMove(e: any) {
      startDrag(e, false)
    },
  }
  if (className) {
    retProps.className = className
  }
  return retProps
}

export function draggable<T = any, U = any>(
  ctx: { state: Context['state']; actions: Context['actions'] },
  dragSettings: DraggableSettings<T>
): Partial<DraggableHooks> {
  return makeDragdropHooks(ctx, dragSettings)
}

export function draggableAndDroppable<T = any, U = any>(
  ctx: { state: Context['state']; actions: Context['actions'] },
  dragSettings: DraggableSettings<T>,
  dropSettings: DroppableSettings<U>
): Partial<DraggableHooks> {
  return makeDragdropHooks(ctx, dragSettings, dropSettings)
}

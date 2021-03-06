import classnames from 'classnames'
import { Context } from './app'
import { DroppableHooks, DroppableSettings, DragdropDefinitions } from './types'

function matchTypes(
  type: string,
  drop: string,
  dropTransforms: DragdropDefinitions['dropTransform']
): boolean {
  if (drop === type) {
    return true
  }
  // Target transforms for the given type
  const targets = dropTransforms[type] || {}
  // Find a match between the targets and drop accept
  return (targets[drop] && true) || false
}

function getTarget(e: MouseEvent) {
  let target: HTMLElement | null = e.target as HTMLElement
  while (
    target &&
    !target.classList.contains('Drop') &&
    target.tagName !== 'BODY'
  ) {
    target = target.parentElement
  }
  if (target && target.classList.contains('Drop')) {
    return target
  }
  return null
}

/** Should leave 'className' inside the props passed to droppable because they
 * are modified and passed back.
 */
export function droppable<T = any>(
  ctx: { actions: Context['actions']; state: Context['state'] },
  settings: DroppableSettings<T>
): DroppableHooks {
  const { drag, definitions } = ctx.state.dragdrop
  const type = drag ? drag.type : undefined
  const dragEnter = ctx.actions.dragdrop.enter
  const dragLeave = ctx.actions.dragdrop.leave
  const { drop, enable, className, onDrop, payload } = settings

  const enabled = enable === undefined || enable === true

  const dropZone = type
    ? matchTypes(type, drop, definitions().dropTransform)
    : undefined

  const noDropKey = typeof enable === 'string' ? enable : 'noDrop'

  return {
    className: classnames(className, {
      Drop: true,
      dropZone: dropZone && enabled,
      [noDropKey]: dropZone && !enabled,
    }),

    onMouseMove(e: MouseEvent) {
      if (dropZone && enabled && !ctx.state.dragdrop.disableDrop) {
        const target = getTarget(e)
        if (!target) {
          return
        }
        if (
          target.classList.contains('hover') ||
          target.classList.contains('dropMark')
        ) {
          // done
          return
        }
        target.classList.add('hover')
        const mark = document.createElement('div')
        mark.classList.add('dropMark')
        target.appendChild(mark)
        dragEnter({
          htmlElement: e.target as HTMLElement,
          drop: {
            type: drop,
            callback: onDrop,
            payload: payload || {},
          },
        })
      } else if (ctx.state.dragdrop.disableDrop) {
        const target = getTarget(e)
        if (!target) {
          return
        }
        target.classList.remove('hover')
        const mark = target.querySelector('.dropMark')
        if (mark) {
          mark.remove()
        }
      }
    },

    onMouseLeave(e: MouseEvent) {
      if (dropZone && enabled) {
        const target = getTarget(e)
        if (!target) {
          return
        }
        target.classList.remove('hover')
        const mark = target.querySelector('.dropMark')
        if (mark) {
          mark.remove()
        }
        dragLeave()
      }
    },
  }
}

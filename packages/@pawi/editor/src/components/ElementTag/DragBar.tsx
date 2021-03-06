import { reference } from '@pawi/build'
import { draggableAndDroppable, DraggableHooks } from '@pawi/dragdrop'
import { sanitizeCommandEvent } from '@pawi/shortcuts'
import { Children, Icon, IconProps } from '@pawi/styled'
import { isCommand } from '@pawi/useragent'
import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../../app'
import { CompositionHolder, ElementOptionsType } from '../../lib'
import {
  dragParaType,
  EditorParaDrag,
  EditorParaDrop,
  editor_dragBar,
  isParaRefDrag,
} from '../../types'
import { getSelection } from '../helpers/getSelection'

const USE_V2 = process.env.NODE_ENV === 'development' && false

export interface DragDivProps {
  dragged?: boolean
  readonly?: boolean
  holder: CompositionHolder
  id: string
  // Composition id when showing elements in the full editor. Not set for
  // single paragraph display (aka fullscreen).
  compId?: string
  selected?: boolean
}

// Fix font-size, line-height so that it is not
// inherited from enclosing h1, h2 or other element.
const DragDiv = styled.span`
  @media print {
    & {
      visibility: hidden;
    }
  }
  font-size: 1rem;
  line-height: 1rem;
  user-select: none;
  cursor: pointer;
  position: absolute;
  top: ${theme.editorBarTop};
  &:not(.right) {
    left: -0.9rem;
  }
  &.right {
    right: -0.9rem;
  }
  width: 0.5rem;
  bottom: ${theme.editorBarBottom};
  &.exported {
    border-right: 6px solid #887558;
  }
  &.selected {
    background: ${theme.editorBarBackground};
    z-index: 2;
  }
  &.selected span {
    opacity: 1;
  }
  &.selected:hover {
    background: ${theme.editorBarBackground};
  }
  &:hover {
    background: ${theme.editorBarHoverBackground};
  }
  &.dropZone {
    left: -30px;
    width: calc(100% + 30px);
    height: 1rem;
    top: auto;
    bottom: -1rem;
    background: #e6be7633;
  }
  &.dropZone:hover {
    background: ${theme.editorBarDraggingBg};
  }
`

const BarIcons = styled.span`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: -1.75rem;
  opacity: 0.5;
`

const BIcon = styled(Icon)`
  color: ${theme.editorBarColor};
  background: ${theme.editorBarBackground};
  padding: 3px 1px;
  border-radius: 4px;
  margin: 0;
  margin-bottom: 5px;
  &.active {
    background: ${theme.editorPopupBg};
  }
  &.active:hover {
    color: ${theme.editorBarColor};
  }
  &:hover {
    color: ${theme.editorBarHoverColor};
  }
`

function preventDefault(e: React.MouseEvent<any>) {
  e.stopPropagation()
  e.preventDefault()
}

export const BarIcon: Comp<IconProps> = props => (
  <BIcon
    {...(props as any)}
    onMouseUp={preventDefault}
    onMouseDown={preventDefault}
    onClick={e => {
      preventDefault(e)
      if (props.onClick) {
        props.onClick(e)
      }
    }}
  />
)

export interface DragBarChildrenProps {
  // paragraph id
  id: string
  // holder id
  holderId: string
}

export function DragBar({
  compId,
  dragged,
  readonly,
  holder,
  id,
  selected,
}: DragDivProps) {
  const ctx = useOvermind()
  const drag: EditorParaDrag | undefined =
    (ctx.state.dragdrop.drag && ctx.state.dragdrop.drag.payload) || undefined
  const { composition } = holder
  if (!composition) {
    return null
  }
  const elem = composition.g[id]
  if (!elem) {
    return null
  }

  let hasPopup = false
  if (elem.s && elem.c) {
    const options = ctx.state.editor.options()
    const customDef = elem.c ? options.paragraphs[elem.c] : undefined
    hasPopup = customDef && customDef.popup ? true : false
  }

  const o: ElementOptionsType = elem.o || {}
  const u = o.u

  // We need the 'DragBar' classname to overide style from
  // DraggedParagraph
  const className = classnames('DragBar', {
    selected,
    exported: o.e,
    right: u === 'r',
  })

  let dragProps: Partial<DraggableHooks> = { className }
  if (!dragged && !readonly && compId !== undefined) {
    // If the holder contains a readonly composition that is not a Proxy, the reference
    // would break so we test readonly first.
    const holderRef = reference(holder)
    dragProps = draggableAndDroppable<EditorParaDrag, EditorParaDrop>(
      ctx,
      // === Drag operation
      {
        className,
        drag: dragParaType,
        payload: {
          sourceRef: holderRef,
          sourceId: id,
          sourceCompId: compId,
        },
        onClick(e) {
          if (isCommand(e)) {
            ctx.actions.editor.toggleOption({ holder, id, key: 'e' })
          } else if (elem.t === 'P') {
            // select all
            ctx.actions.editor.selectParagraph({ holder, id })
          }
        },
      },
      // === Drop operation
      {
        className,
        drop: dragParaType,
        // Only show drag if we are moving on the same editor (other drop => )
        enable: drag && isParaRefDrag(drag) && drag.sourceCompId === compId,
        payload: {
          holderRef,
          id,
          compId,
        },
        onDrop: ctx.actions.editor.dropParagraph,
      }
    )
  }

  const icons = !dragged && !o.title
  return (
    <DragDiv contentEditable={false} {...dragProps}>
      {icons && (
        <BarIcons className="BarIcons">
          <Children
            noTag
            family={editor_dragBar}
            id={id}
            holderId={holder.id}
          />
          {selected && (
            <BarIcon
              icon={`align_${o.a || 'd'}`}
              className={o.a ? 'active' : ''}
              onClick={e =>
                ctx.actions.editor.cycleAlign({
                  holder,
                  id,
                  cmd: sanitizeCommandEvent(e),
                })
              }
            />
          )}
          {USE_V2 && selected && (
            <BarIcon
              icon={`Column`}
              className={o.u ? 'active' : ''}
              onClick={e => {
                if (compId) {
                  const selection = getSelection(compId)
                  if (selection) {
                    ctx.actions.editor.toggleColumn({
                      holder,
                      selection,
                      id,
                    })
                  }
                  e.preventDefault()
                }
              }}
            />
          )}

          {hasPopup && selected ? (
            <BarIcon
              className={o.open ? 'active' : ''}
              icon="OpenPopup"
              onClick={() =>
                ctx.actions.editor.toggleOption({
                  holder,
                  id,
                  key: 'open',
                })
              }
            />
          ) : null}
        </BarIcons>
      )}
    </DragDiv>
  )
}

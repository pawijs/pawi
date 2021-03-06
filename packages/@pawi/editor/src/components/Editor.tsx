import { reference } from '@pawi/build'
import { droppable, dropStyles } from '@pawi/dragdrop'
import { makeCommand, sanitizeCommandEvent } from '@pawi/shortcuts'
import { isCommand } from '@pawi/useragent'
import classnames from 'classnames'
import { IReactComponent } from 'overmind-react'
import * as React from 'react'
import { Comp, Context, styled, theme, useOvermind } from '../app'
import * as makeref from '../lib/utils/makeRef'
import { selectAll } from '../lib/utils/rangeSelection'
import {
  CaretSelectionType,
  CompositionHolder,
  ElementType,
  isCustomElement,
  isRangeSelection,
  RangeSelectionType,
  SelectionType,
} from '../lib/utils/types'
import {
  dragParaType,
  EditorParaDrag,
  EditorParaDrop,
  isParaRefDrag,
  SPACER,
} from '../types'
import { EditorStyles } from './EditorStyles'
import { ElementTag } from './ElementTag'
import { expandPages } from './helpers/expandInner'
import { getSelection } from './helpers/getSelection'
import { isInputEvent } from './helpers/isInputEvent'
import { Toolbox } from './Toolbox'

const USE_V2 = process.env.NODE_ENV === 'development' && false
if (USE_V2) {
  console.log('[editor] Using v2')
}

export type HeaderFooterComponentType = IReactComponent<{
  holder: CompositionHolder
  noPagination?: boolean
  page: number
  pageCount: number
}>

export interface EditorProps {
  compId?: string
  className?: string
  customTagProps?: any
  readonly?: boolean
  readonlyClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  noPagination?: boolean
  header?: HeaderFooterComponentType
  footer?: HeaderFooterComponentType
  holder: CompositionHolder
  // When there is no title, what should
  // we display as placeholder
  titlePlaceholder?: string
  children?: any
  // When dragging a paragraph: prevent resize
  dragged?: boolean
}

export interface WrapEditorProps extends EditorProps {
  ctx: {
    state: Context['state']
    actions: Context['actions']
    effects: Context['effects']
  }
  keys: string
  sizes: string
  // Used to detect paragraph drag operations
  drag: any
  drop: any
}

interface EditorClassProps extends EditorProps {
  drop: any
  actions: Context['actions']
  theme: typeof theme
  options: Context['state']['editor']['options']
  runShortcut: Context['effects']['shortcuts']['run']
  firstOnly?: boolean
}

export function getInputValue() {
  const sel = window.getSelection()
  if (!sel) {
    return undefined
  }
  const { anchorNode } = sel
  if (!anchorNode) {
    return undefined
  }

  const text = anchorNode.textContent || ''
  const pos = text.indexOf(SPACER)
  if (pos >= 0) {
    return text.replace(SPACER, '')
  }
  return text
}

const EditorWrapper = styled.div`
  width: ${theme.pageWidth};
  &.noPagination {
    width: 100%;
    .Page,
    .Content,
    .Header,
    .Footer {
      width: auto;
      overflow: auto;
      /*overflow: hidden; */
    }
    .Content {
      padding-left: ${theme.editorNoPaginationHMargin};
      padding-right: ${theme.editorNoPaginationHMargin};
    }
    .Page {
      margin: 0;
      padding: 0;
      min-height: auto;
      box-shadow: none;
      width: 100%;
    }
    .Content-off > * {
      border: 1px solid #bd62ae;
      margin: 1rem;
      background: #ff00002e;
    }
  }
  ${dropStyles};
`

// This is used to set relative position of Editor content so that
// selections can be measured.
const EditorPositioner = styled.div`
  position: relative;
`

class EditorClass extends React.Component<EditorClassProps> {
  deletedSelection: SelectionType | undefined
  // sttringified version of selection
  lastSelection: string
  // editor id used to track paths (random value)
  id: string
  deadKey: boolean = false

  constructor(props: EditorClassProps) {
    super(props)

    this.deletedSelection = undefined
    this.lastSelection = ''
    // We use an extra indirection so that we can mock during
    // testing.
    this.id = makeref.makeRef()
  }

  onSelect(e: React.SyntheticEvent<HTMLDivElement>) {
    if (this.props.readonly) {
      return
    }
    // When comming back to the editor window, this triggers AFTER the first key stroke
    // which is bad if the keystroke changes the selection as this sends the previous
    // selection. Check if selection is the same as last to avoid this.
    const { actions, holder } = this.props

    const selection = getSelection(this.id) as RangeSelectionType
    if (!selection) {
      // Trying to select outside of edit zone. Reset to last valid selection
      if (this.lastSelection) {
        const sel = JSON.parse(this.lastSelection) as CaretSelectionType
        actions.editor.selectChange({ holder, selection: sel })
      }
      return
    }
    const strSelection = JSON.stringify(selection)
    if (strSelection === this.lastSelection) {
      // noop
    } else {
      this.lastSelection = strSelection
      actions.editor.selectChange({ holder, selection })
    }
  }

  onPaste(e: React.ClipboardEvent<HTMLDivElement>) {
    if (this.props.readonly) {
      return
    }
    e.preventDefault()
    const selection = getSelection(this.id)
    if (selection) {
      const { holder, actions } = this.props
      actions.editor.paste({ holder, event: e, selection })
    }
  }

  onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (this.props.readonly) {
      return
    }
    const { actions, holder, options } = this.props
    const opt = options()

    const selection = getSelection(this.id)
    this.deadKey = false

    if (isCommand(e)) {
      const cmd = makeCommand(e)
      switch (cmd) {
        case 'cmd+a': {
          e.preventDefault()
          actions.editor.selectChange({
            holder,
            selection: selectAll(holder.composition!),
          })
          return
        }
        case 'cmd+c': {
          e.preventDefault()
          if (selection) {
            actions.editor.copy({ holder, selection })
          }
          return
        }
        case 'cmd+v': {
          // Let 'onPaste' handle this
          return
        }
        case 'cmd+x': {
          e.preventDefault()
          if (selection) {
            actions.editor.cut({ holder, selection })
          }
          return
        }
        case 'cmd+enter': {
          // Create a page-break paragrph later.
          break
        }
        default: {
          // TODO: add shortcuts definitions for paragraphs and such ?
          // if (runShortcut(e, 'editor', { holder, selection })) {
          //   return
          // }
          if (selection) {
            const para = opt.paragraphList.find(p => p.accel === cmd)
            if (para) {
              e.preventDefault()
              actions.editor.applyOp({
                holder,
                selection,
                op: para.op,
                opts: JSON.parse(para.payload),
              })
              return
            }
          }
        }
      }
    }

    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        this.deletedSelection = undefined
        if (!selection || isRangeSelection(selection)) {
          // Should not happen: ignore.
          return
        }
        if (USE_V2) {
          // TODO: Do we need selection ?
          actions.edit.enter({ holder, cmd: sanitizeCommandEvent(e) })
        } else {
          actions.editor.enterPress({
            holder,
            selection,
            shift: e.shiftKey,
            cmd: isCommand(e),
          })
        }
        return
      case 'Backspace':
      case 'Delete':
        e.preventDefault()
        this.deletedSelection = undefined
        if (!selection) {
          return
        }
        if (USE_V2) {
          // TODO: Do we need selection ?
          actions.edit.backspace({ holder })
        } else {
          actions.editor.applyOp({ holder, selection, op: e.key, opts: {} })
        }
        return
      case 'Dead':
        this.deadKey = true
        // Should mark
        return
      default: {
        if (!isInputEvent(e)) {
          return
        }

        if (selection) {
          const { anchorPath } = selection
          if (anchorPath.length === 1) {
            const { composition } = holder
            if (composition) {
              const elem = composition.g[anchorPath[0]]
              if (elem && isCustomElement(elem)) {
                // Ignore keys on custom elements.
                e.preventDefault()
                // Do not stop propagation in case we have global shortcuts.
                return
              }
            }
          }
        }
      }
    }

    if (
      selection &&
      isRangeSelection(selection) &&
      selection.anchorPath.join('.') !== selection.focusPath.join('.')
    ) {
      this.deletedSelection = selection
      // Change selection to caret (we don't want the Browser to
      // delete any DOM element because this will trigger a React
      // DOMException).
      const sel = window.getSelection()
      const range = document.createRange()
      if (sel && sel.anchorNode) {
        const content = sel.anchorNode.textContent || ''
        range.setStart(sel.anchorNode, selection.anchorOffset)
        range.setEnd(sel.anchorNode, content.length)
        sel.removeAllRanges()
        sel.addRange(range)
      }
      // Let browser continue with edit...
    }
  }

  onInput(e: React.FormEvent<HTMLDivElement>) {
    if (this.props.readonly) {
      return
    }
    if (this.deadKey) {
      return
    }
    const { actions, holder } = this.props

    let selection = getSelection(this.id)
    if (!selection) {
      return
    }
    const value = getInputValue()
    if (value !== undefined) {
      if (this.deletedSelection) {
        // There was a Range selection before input and we need to delete before
        // we update content.
        selection = this.deletedSelection
        this.deletedSelection = undefined
      }
      if (USE_V2) {
        actions.edit.textChanged({ holder, s: selection, i: value })
      } else {
        actions.editor.applyOp({
          holder,
          selection,
          op: 'Input',
          opts: { i: value },
        })
      }
    }
  }

  onClick(e: React.MouseEvent<HTMLDivElement>) {
    if (this.props.readonly && this.props.readonlyClick) {
      const target = e.currentTarget
      const content = target.querySelector('.Content')
      if (!content) {
        return this.props.readonlyClick(e)
      }
      const rect = content.getBoundingClientRect()
      const dtop = e.clientY - rect.top
      const dleft = e.clientX - rect.left
      const styles = getComputedStyle(content)
      if (
        dtop > parseInt(styles.paddingTop) &&
        dleft > parseInt(styles.paddingLeft)
      ) {
        console.log({ dtop, dleft })
        // Only trigger readonly Click inside Content
        this.props.readonlyClick(e)
      }
    }
  }

  render() {
    this.id = this.props.compId || this.id
    const { theme, className, holder, noPagination, drop } = this.props
    const { composition } = holder
    const sizes = composition ? composition.sz : {}
    // : parseFloat(theme.pageHeight) -
    const pageSize = noPagination
      ? 0
      : parseFloat(theme.pageRatio + '') * parseFloat(theme.pageWidth) -
        parseFloat(theme.pageHeaderHeight) -
        parseFloat(theme.pageFooterHeight)
    return (
      <EditorWrapper
        className={classnames('Editor', className, { noPagination })}
        {...drop}
      >
        <EditorPositioner>
          <EditorStyles
            className="styles"
            id={this.id}
            data-compid={this.id}
            contentEditable={!this.props.readonly}
            onInput={e => this.onInput(e)}
            onKeyDown={e => this.onKeyDown(e)}
            onPaste={e => this.onPaste(e)}
            onSelect={e => this.onSelect(e)}
            onClick={e => this.onClick(e)}
            suppressContentEditableWarning
          >
            {expandPages(
              ElementTag,
              this.props,
              pageSize,
              sizes || {},
              this.id,
              this.props.firstOnly
            )}
          </EditorStyles>
          {this.props.children}
          {!this.props.readonly && <Toolbox holder={holder} compId={this.id} />}
        </EditorPositioner>
      </EditorWrapper>
    )
  }
}

function propsAreEqual(oldprops: WrapEditorProps, newprops: WrapEditorProps) {
  // Only do a full re-render if keys change
  // FIXME: should re-render on sizes change to repaginate...
  return (
    (newprops.keys ? oldprops.keys === newprops.keys : false) &&
    oldprops.drag === newprops.drag &&
    oldprops.compId === newprops.compId &&
    oldprops.sizes === newprops.sizes &&
    oldprops.holder === newprops.holder
  )
}

const EdMemo: Comp<WrapEditorProps> = React.memo<WrapEditorProps>(props => {
  // firstOnly enables faster load and initial display
  const [firstOnly, setFirstOnly] = React.useState(true)
  React.useEffect(() => {
    if (firstOnly) {
      const timer = setTimeout(() => {
        setFirstOnly(false)
      }, 100)
      return () => clearTimeout(timer)
    }
    return undefined
  })

  const actions = props.ctx.actions
  const { state } = props.ctx
  return (
    <EditorClass
      actions={actions}
      theme={state.theme.selectedTheme as typeof theme}
      options={state.editor.options}
      runShortcut={props.ctx.effects.shortcuts.run}
      firstOnly={firstOnly}
      {...props}
    />
  )
}, propsAreEqual)

function serializeOne(key: string, elem: ElementType) {
  return `${key}-${elem.p}-${elem.t}`
}
export const Editor: Comp<EditorProps> = function Editor(props) {
  const ctx = useOvermind()
  const comp = props.holder.composition
  const keys = comp
    ? Object.keys(comp.g)
        .map(k => serializeOne(k, comp.g[k]))
        .join('.')
    : ''
  const sizes = comp ? JSON.stringify(comp.sz) : ''

  const dragging = ctx.state.dragdrop.drag
  let dragChangeFlag: any = undefined
  let drop: any = {}
  if (dragging) {
    // Cannot check that dragging.type === dragParaType: this is droppable's job
    // and it uses dropTransforms.
    const p = dragging.payload as EditorParaDrag
    dragChangeFlag = p
    if (
      (!isParaRefDrag(p) || p.sourceCompId !== props.compId) &&
      !props.readonly
    ) {
      const holderRef = reference(props.holder)
      drop = droppable<EditorParaDrop>(ctx, {
        className: classnames('Editor', props.className, {
          noPagination: props.noPagination,
        }),
        drop: dragParaType,
        payload: {
          holderRef,
          compId: props.compId || 'current',
        },
        onDrop: ctx.actions.editor.dropParagraph,
      })
    }
  }
  return (
    <EdMemo
      ctx={ctx}
      keys={keys}
      sizes={sizes}
      drag={dragChangeFlag}
      drop={drop}
      {...props}
    />
  )
}

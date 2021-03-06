import * as React from 'react'

import {
  CaretSelectionType,
  CompositionHolder,
  CustomElementType,
  ElementSize,
  ElementType,
  ParagraphProps,
} from '../../lib/utils/types'
import { Comp, Context, styled, useOvermind } from '../../app'

import { DragBar } from './DragBar'
import { ParagraphPopup } from '../ParagraphPopup'
import classnames from 'classnames'
import { setSelection } from '../helpers/setSelection'

export type ElementTagType = Comp<ParagraphProps>

export const Relative = styled.div`
  position: relative;
`

export const CursorSelector = styled.div`
  position: absolute;
  width: 0;
  top: 0;
  left: 0;
  opacity: 0;
`

export function cursorKeyDown(e: React.KeyboardEvent<any>) {
  e.preventDefault()
  e.stopPropagation()
}

function block(e: any) {
  e.stopPropagation()
}

// We block everything but mouseUp (required by drag&drop)
export const blockEvents = {
  onChange: block,
  onDoubleClick: block,
  onMouseDown: block,
  onKeyDown: block,
  onInput: block,
  onSelect: block,
  onPaste: block,
}

interface CustomTagWrapperProps {
  dragged?: boolean
  readonly?: boolean
  // Extra tag props passed from Editor.
  customTagProps: any
  elem: ElementType
  compId?: string
  // The paragraph id.
  id: string
  // The path to the composition.
  holder: CompositionHolder
}

interface CustomTagClassProps extends CustomTagWrapperProps {
  dragged?: boolean
  selectChange: Context['actions']['editor']['selectChange']
  sizeChange: Context['actions']['editor']['sizeChange']
  toggleOption: Context['actions']['editor']['toggleOption']
  elem: ElementType
  size: ElementSize
  options: Context['state']['editor']['options']
}

const Custom = styled.div`
  position: relative;
`

const ErrorDiv = styled.div`
  padding: 5px;
  background: #faa;
  border: 1px solid red;
  border-radius: 5px;
`

// FIXME: refactor using useState and useEffects
class CustomTagClass extends React.Component<CustomTagClassProps> {
  el: React.RefObject<HTMLDivElement>
  selected: boolean = false

  constructor(props: CustomTagClassProps) {
    super(props)
    this.el = React.createRef()
  }

  componentDidMount() {
    this.resized()
  }

  componentDidUpdate() {
    this.resized()
  }

  resized() {
    const { el, props } = this
    if (!el.current || props.dragged) {
      return
    }

    const { compId, sizeChange, elem, id, holder, size: savedSize } = props

    if (elem.s && compId) {
      const cursor = el.current.querySelector('.cursor') as HTMLElement
      if (cursor && !this.selected) {
        // We avoid reselecting to not steal focus in custom element.
        this.selected = true
        // We need to setSelection on CustomElement so that we capture keys
        // like next/previous or delete.
        setSelection(compId, cursor, elem.s)
      }
    } else {
      this.selected = false
    }

    const styles = getComputedStyle(el.current)
    const size = {
      c:
        parseInt(styles.height || '0') +
        parseInt(styles.paddingBottom || '0') +
        parseInt(styles.paddingTop || '0'),
      t: parseInt(styles.marginTop || '0'),
      b: parseInt(styles.marginBottom || '0'),
    }
    if (size.c && savedSize.c !== size.c) {
      sizeChange({ key: id, holder, size })
    }
  }

  render() {
    const {
      options: opt,
      selectChange,
      toggleOption,
      id,
      holder,
      customTagProps,
      compId,
    } = this.props
    const composition = holder.composition!
    const elem = composition.g[id]
    const { smin, smax } = composition
    const options = opt()

    if (!elem) {
      return null
    }

    const customDef = elem.c ? options.paragraphs[elem.c] : undefined
    if (!customDef || !customDef.component) {
      console.error(`Invalid custom tag '${elem.c}': cannot render this.`)
      return <p className="error" />
    } else {
      const Tag = customDef.component

      function click(e: React.MouseEvent<HTMLDivElement>) {
        if (elem.o && elem.o.open) {
          e.preventDefault()
          e.stopPropagation()
          toggleOption({ holder, id, key: 'open' })
        }
        // select...
        const selection: CaretSelectionType = {
          anchorPath: [id],
          anchorOffset: 0,
          type: 'Caret',
          position: { top: 0, left: 0 },
        }
        selectChange({ holder, selection })
      }

      const selected =
        smin !== undefined &&
        smax !== undefined &&
        elem.p >= smin &&
        elem.p <= smax
      // FIXME: we have to deal with attachment in another way. Something like:
      // const attach = dragProvider.attach(customTagProps, customDef, id)
      // const attach: DragAttachment =
      /*
      const attach = {
        icon,
        id: this.props.customTagProps.id,
        para: id,
      }
      */
      const data = (holder.composition!.data || {})[id]
      if (!data) {
        return (
          <ErrorDiv>
            Invalid custom paragraph '{id}
            ': missing data field.
          </ErrorDiv>
        )
      }

      return (
        <Custom
          className={classnames('Custom', elem.c, `align_${elem.o?.a || 'd'}`)}
          data-ref={id}
          data-c={elem.c}
          onClick={click}
          // FIXME: This should not be needed. Maybe there is a fix in a newer version
          // of styled components.
          ref={this.el as any}
          {...blockEvents}
        >
          {!customDef.noCursor && (
            // Must come first so that it exists on setSelection call
            <CursorSelector
              className="cursor"
              // This does not seem to work...
              // FIXME: Can we have shortcuts that target the selected
              // custom element ?
              onKeyDown={cursorKeyDown}
              onInput={cursorKeyDown}
              onChange={cursorKeyDown}
            >
              {'\u200B'}
            </CursorSelector>
          )}
          <ParagraphPopup
            holder={holder}
            customTagProps={customTagProps}
            id={id}
            data={data}
            paragraph={elem as CustomElementType}
          />
          <DragBar
            dragged={this.props.dragged}
            readonly={this.props.readonly}
            selected={selected}
            compId={compId}
            id={id}
            holder={holder}
          />
          <div contentEditable={false} style={{ userSelect: 'none' }}>
            <Tag
              holder={holder}
              customTagProps={customTagProps}
              id={id}
              data={data}
              paragraph={elem as CustomElementType}
            />
          </div>
          {/*
            <Spacer
              key={id + 'Spacer'}
              holder={holder}
              prevRef={id}
            />
            */}
        </Custom>
      )
    }
  }
}

export const CustomTag: Comp<CustomTagWrapperProps> = function CustomTag(
  props
) {
  const app = useOvermind()
  const { composition } = props.holder
  if (!composition) {
    return null
  }
  const savedSize = (composition.sz || {})[props.id] || {}
  const { elem, dragged: dragging } = props

  if (!elem) {
    return null
  }
  return (
    <CustomTagClass
      dragged={dragging}
      selectChange={app.actions.editor.selectChange}
      sizeChange={app.actions.editor.sizeChange}
      toggleOption={app.actions.editor.toggleOption}
      options={app.state.editor.options}
      size={savedSize}
      {...props}
    />
  )
}

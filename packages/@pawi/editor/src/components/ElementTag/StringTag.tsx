import { Children, Icon } from '@pawi/styled'
import * as React from 'react'
import { Comp, Context, styled, theme, useOvermind } from '../../app'
import {
  CaretSelectionType,
  CompositionHolder,
  ElementSize,
  ElementType,
  isListItem,
  isStringElement,
  isTitle,
  RangeSelectionType,
} from '../../lib/utils/types'
import { editor_titleExtra, SPACER } from '../../types'
import { getElementClassName } from '../helpers/getElementClassName'
import { getElementTag } from '../helpers/getElementTag'
import { getTextNode, setSelection } from '../helpers/setSelection'
import { blockEvents } from './CustomTag'
import { DragBar } from './DragBar'

interface StringTagProps {
  dragged?: boolean
  readonly?: boolean
  selected?: boolean
  // A random string when element is shown inside the full editor.
  compId?: string
  // Root element
  isParagraph?: boolean
  id: string
  key: string
  elem: ElementType
  holder: CompositionHolder
  titlePlaceholder?: string
}

interface StringTagClassProps extends StringTagProps {
  sizeChange: Context['actions']['editor']['sizeChange']
  options: Context['state']['editor']['options']
  savedSize: ElementSize
  selection: CaretSelectionType | RangeSelectionType | undefined
}

function noBackspace(text: string) {
  return text === '' ? SPACER : text.replace(/([ \n])$/g, '$1 ') // utf8 no-backspace sttring
}

export type ElementTagType = React.ComponentClass<StringTagProps>

const TWrapper = styled.div`
  overflow: hidden;
  margin-left: calc(-1 * ${theme.pageMarginLeftRight});
  margin-right: calc(-1 * ${theme.pageMarginLeftRight});
`

const MyChildren = styled(Children)`
  box-shadow: ${theme.editorTitleExtraShadow};
  background: ${theme.editorTitleExtraBg};
  padding: 0 3px;
  margin-left: -3px;
  margin-right: -3px;
`

class StringTagClass extends React.Component<StringTagClassProps> {
  el: React.RefObject<any>

  constructor(props: StringTagClassProps) {
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
    const { el } = this
    if (!el.current) {
      return
    }
    const { sizeChange, elem, id, holder, isParagraph, savedSize } = this.props

    if (elem.s && this.props.compId) {
      setSelection(this.props.compId, el.current, elem.s)
    } else if (!isParagraph && isStringElement(elem)) {
      // Changed span but does not have selection. Check if some typing
      // has occurred in the wrong span (typing at end of this element
      // instead of start of next one)
      const node = getTextNode(el.current)
      if (node) {
        const text = (node.textContent || '').replace(/ +$/g, '') // remove utf8 no-backspace string
        if (text !== elem.i) {
          el.current.innerHTML = elem.i === '' ? SPACER : elem.i
        }
      }
    }

    if (!isParagraph || this.props.dragged) {
      // Not a root paragraph:
      // do not record size for inner elements of groups: Parent triggers the resize.
      return
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
      compId,
      dragged,
      elem,
      id,
      holder,
      isParagraph,
      selected,
      titlePlaceholder,
      readonly,
      options,
    } = this.props

    const opts = elem.o && elem.o.t ? options().paragraphs[elem.o.t] : undefined
    const Tag = getElementTag(elem, isParagraph)
    const className = getElementClassName(
      elem,
      opts ? opts.className : undefined
    )
    const icon =
      opts && opts.paragraphIcon ? <Icon icon={opts.paragraphIcon} /> : null

    const text = elem.i || ''

    // Only show page break when in full editor (aka compId not undefined)
    const pageBreak = compId && elem.o && elem.o.n

    if (isParagraph) {
      let result: JSX.Element
      if (text === '') {
        // Empty paragraph
        result = (
          <Tag
            className={className}
            data-ref={id}
            data-placeholder={titlePlaceholder}
            ref={this.el}
          >
            {icon}
            {pageBreak ? <Icon className="PageBreak" icon="PageBreak" /> : null}
            {SPACER}
          </Tag>
        )
      } else {
        result = (
          <Tag className={className} data-ref={id} ref={this.el}>
            <DragBar
              dragged={dragged}
              readonly={readonly}
              selected={selected}
              compId={compId}
              id={id}
              holder={holder}
            />
            {icon}
            {pageBreak ? <Icon className="PageBreak" icon="PageBreak" /> : null}
            {
              noBackspace(text)
              /* If 'str' ends with a space, it will not display. Bug #92 */
            }
          </Tag>
        )
      }

      if (isTitle(elem)) {
        return (
          <React.Fragment>
            {result}
            <TWrapper contentEditable={false} {...blockEvents}>
              <MyChildren family={editor_titleExtra} />
            </TWrapper>
          </React.Fragment>
        )
      } else {
        return result
      }
    } else if (Tag === 'br') {
      return <Tag className={className} data-ref={id} ref={this.el} />
    } else {
      // Sub element in a group
      return (
        <Tag className={className} data-ref={id} ref={this.el}>
          {text === '' ? SPACER : text}
        </Tag>
      )
    }
  }
}

export const StringTag: Comp<StringTagProps> = function StringTag(props) {
  const ctx = useOvermind()
  const { composition } = props.holder
  if (!composition) {
    return null
  }
  const savedSize = (composition.sz || {})[props.id] || {}
  const { elem } = props

  if (!elem) {
    return null
  }

  if (props.isParagraph && !isListItem(elem)) {
    const { smin, smax } = composition
    const selected = elem.o?.title
      ? false
      : elem.s !== undefined ||
        (smin !== undefined &&
          smax !== undefined &&
          elem.p >= smin &&
          elem.p <= smax)

    // re-render on elem.s change
    // elem.s
    return (
      <StringTagClass
        sizeChange={ctx.actions.editor.sizeChange}
        options={ctx.state.editor.options}
        savedSize={savedSize}
        selection={elem.s}
        selected={selected}
        {...props}
      />
    )
  } else {
    return (
      <StringTagClass
        sizeChange={ctx.actions.editor.sizeChange}
        options={ctx.state.editor.options}
        savedSize={savedSize}
        selection={elem.s}
        {...props}
      />
    )
  }
}

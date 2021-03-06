import * as React from 'react'

import { Comp, Context, useOvermind } from '../../app'
import {
  CompositionHolder,
  ElementSize,
  GroupElementType,
} from '../../lib/utils/types'

import { DragBar } from './DragBar'
import { EditorProps } from '../Editor'
import classnames from 'classnames'
import { expandInner } from '../helpers/expandInner'
import { getAtPath } from '../../lib/utils/getAtPath'
import { getElementClassName } from '../helpers/getElementClassName'
import { getElementTag } from '../helpers/getElementTag'
import { setSelection } from '../helpers/setSelection'

export interface GroupTagProps {
  dragged?: boolean
  readonly?: boolean
  // Composition id, only set when displaying in the full editor.
  compId?: string
  isParagraph?: boolean
  editorProps: EditorProps
  holder: CompositionHolder
  id: string
  key: string
  // Path inside the composition. For root element, this is the
  // same as [id].
  path: string[]
}

interface GroupTagClassProps extends GroupTagProps {
  selected?: boolean
  savedSize: ElementSize
  sizeChange: Context['actions']['editor']['sizeChange']
}

class GroupTagClass extends React.Component<GroupTagClassProps> {
  el: React.RefObject<any>

  constructor(props: GroupTagClassProps) {
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
    if (!el.current || this.props.dragged) {
      return
    }

    const { sizeChange, id, holder, path, savedSize } = this.props
    const { composition } = holder
    if (!composition) {
      return
    }
    const elem = getAtPath(composition, path)
    if (!elem) {
      return
    }

    if (path.length > 1) {
      // No selection or resizing for sub elements
      return
    }

    // Set DOM selection
    if (elem.s && this.props.compId) {
      // Not sure we ever set selection on group.
      setSelection(this.props.compId, el.current, elem.s)
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
    try {
      const {
        editorProps,
        path,
        id,
        holder,
        compId,
        isParagraph,
        selected,
      } = this.props
      const { composition } = holder
      if (!composition) {
        return null
      }
      const elem = getAtPath(composition, path)
      if (!elem) {
        // Do not know why we need this. parseInner should remove.
        return null
      }
      const Tag = getElementTag(elem)
      const className = getElementClassName(elem)
      if (isParagraph) {
        return (
          <Tag
            className={classnames(className, 'Group')}
            data-ref={id}
            ref={this.el}
          >
            <DragBar
              readonly={this.props.readonly}
              dragged={this.props.dragged}
              selected={selected}
              compId={compId}
              id={id}
              holder={holder}
            />
            {expandInner(editorProps, elem as GroupElementType, path, compId)}
          </Tag>
        )
      } else {
        return (
          <Tag className={className} data-ref={id} ref={this.el}>
            {expandInner(editorProps, elem as GroupElementType, path, compId)}
          </Tag>
        )
      }
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

export const GroupTag: Comp<GroupTagProps> = function GroupTag(props) {
  const ctx = useOvermind()
  const { composition } = props.holder
  if (!composition) {
    return null
  }

  const savedSize = (composition.sz || {})[props.id] || {}

  if (props.isParagraph) {
    const { smin, smax } = composition
    const elem = composition.g[props.id]
    if (!elem) {
      return null
    }
    const selected = elem.o?.title
      ? false
      : smin !== undefined &&
        smax !== undefined &&
        elem.p >= smin &&
        elem.p <= smax

    return (
      //<Relative>
      <GroupTagClass
        sizeChange={ctx.actions.editor.sizeChange}
        selected={selected}
        savedSize={savedSize}
        {...props}
      />
      //</Relative>
    )
  } else {
    return (
      <GroupTagClass
        sizeChange={ctx.actions.editor.sizeChange}
        savedSize={savedSize}
        {...props}
      />
    )
  }
}

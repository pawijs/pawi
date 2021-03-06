import * as React from 'react'

import { Comp, useOvermind } from '../../app'
import {
  CompositionHolder,
  isCustomElement,
  isDocumentTitle,
  isGroupElement,
  isStringElement,
} from '../../lib/utils/types'

import { CustomTag } from './CustomTag'
import { EditorProps } from '../Editor'
import { GroupTag } from './GroupTag'
import { IReactComponent } from 'overmind-react'
import { StringTag } from './StringTag'
import { getAtPath } from '../../lib/utils/getAtPath'

export { BarIcon } from './DragBar'

export interface ElementTagProps {
  // Composition id (when displaying a full composition).
  compId?: string
  editorProps: EditorProps
  holder: CompositionHolder
  isParagraph?: boolean
  // Unique id of the element
  id: string
  // Path to the element inside the composition. For root
  // paragraphs, path === [id]
  path: string[]
}

export type ElementTagType = IReactComponent<ElementTagProps>

export const ElementTag: Comp<ElementTagProps> = React.memo(
  ({ editorProps, id, path, isParagraph, compId }) => {
    // start tracking
    const ctx = useOvermind()
    const { holder, titlePlaceholder } = editorProps

    if (!holder.composition) {
      // Edit or display an item without a composition: create one
      // on the fly...
      ctx.actions.editor.ensureComposition({ holder })
      return null
    }
    const elem = getAtPath(holder.composition, path, true)
    if (!elem) {
      return null
    }

    if (isCustomElement(elem)) {
      return (
        <CustomTag
          key={id}
          id={id}
          dragged={editorProps.dragged}
          readonly={editorProps.readonly}
          customTagProps={editorProps.customTagProps || {}}
          elem={elem}
          compId={compId}
          holder={holder}
        />
      )
    } else if (isStringElement(elem)) {
      return (
        <StringTag
          key={id}
          id={id}
          dragged={editorProps.dragged}
          readonly={editorProps.readonly}
          isParagraph={isParagraph}
          elem={elem}
          compId={compId}
          holder={holder}
          titlePlaceholder={
            isDocumentTitle(elem) ? titlePlaceholder : undefined
          }
        />
      )
    } else if (isGroupElement(elem)) {
      return (
        <GroupTag
          dragged={editorProps.dragged}
          readonly={editorProps.readonly}
          isParagraph={isParagraph}
          compId={compId}
          editorProps={editorProps}
          id={id}
          holder={holder}
          path={path}
          key={id}
        />
      )
    } else {
      console.log(elem)
      throw new Error(
        `Invalid element '${id}' in composition '${holder}' (${JSON.stringify(
          elem
        )}).`
      )
    }
  }
)

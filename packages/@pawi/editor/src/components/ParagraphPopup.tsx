import * as React from 'react'

import { Comp, styled, theme, useOvermind } from '../app'

import { InternalParagraphOption } from '../lib/utils/types'
import { ParagraphProps } from '../lib'
import { blockEvents } from './ElementTag/CustomTag'

export type ParagraphPopupProps = ParagraphProps

const PopupWrapper = styled.div`
  position: absolute;
  top: ${theme.fieldMargin};
  left: -1rem;
  box-shadow: ${theme.cardBoxShadow};
  display: flex;
  flex-direction: column;
  padding-bottom: ${theme.fieldMargin};
  background: ${theme.editorPopupBg};
  border-radius: 3px;
  z-index: 4;
`

export const ParagraphPopup: Comp<ParagraphProps> = ({
  holder,
  id,
  paragraph,
  customTagProps,
  data,
}) => {
  const ctx = useOvermind()
  const options = ctx.state.editor.options()
  let Popup: InternalParagraphOption<any>['popup']
  const customDef = paragraph.c ? options.paragraphs[paragraph.c] : undefined
  if (!customDef || !customDef.popup || !paragraph.s) {
    return null
  } else {
    Popup = customDef.popup
  }

  const open = paragraph.o && paragraph.o.open
  if (!open) {
    return null
  }

  return (
    <PopupWrapper {...blockEvents} onClick={e => e.stopPropagation()}>
      <Popup
        holder={holder}
        customTagProps={customTagProps}
        id={id}
        data={data}
        paragraph={paragraph}
      />
    </PopupWrapper>
  )
}

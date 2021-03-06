import { resolve } from '@pawi/build'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { CompositionHolder, newComposition } from '../lib'
import { EditorParaDrag, isParaRefDrag } from '../types'
import { EditorStyles } from './EditorStyles'
import { ElementTag } from './ElementTag'

export type DraggedParagraphProps = EditorParaDrag

// We use a variable to avoid automatic indentation to break
// parsing...
const width = `calc(${theme.pageWidth} - ${theme.pageMarginLeftRight} - ${theme.pageMarginLeftRight})`

const PageMock = styled(EditorStyles)`
  top: ${theme.editorBarTop};
  padding-left: 15px;
  width: ${width};
  & .DragBar,
  & .DragBar:hover {
    top: ${theme.editorParagraphsVMarginNeg};
    bottom: ${theme.editorParagraphsVMarginNeg};
    background: ${theme.editorBarDraggingBg};
  }
`

const Wrapper = styled(EditorStyles)`
  width: 300px;
  max-height: 150px;
  overflow: hidden;
  background: #fff;
  opacity: 0.93;
  border: 1px solid #bdb29d;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
`

export const DraggedParagraph: Comp<DraggedParagraphProps> = props => {
  const ctx = useOvermind()
  let holder: CompositionHolder | undefined
  let sourceId = 'any'

  if (isParaRefDrag(props)) {
    holder = resolve(ctx, props.sourceRef)
    sourceId = props.sourceId
    if (!holder) {
      console.log('Invalid sourceRef in DraggedParagraph', props.sourceRef)
      return null
    }
  } else {
    const comp = newComposition()
    sourceId = comp.spath!
    comp.data = {
      [sourceId]: props.data,
    }
    comp.g[sourceId].c = props.c
    holder = {
      composition: comp,
    }
  }
  return (
    <Wrapper>
      <PageMock>
        <ElementTag
          editorProps={{ holder, dragged: true }}
          // We pass `holder` directly because of tracking that needs
          // to detect state stuff in props and we should not hide it
          // inside another object.
          holder={holder}
          compId={''}
          isParagraph
          path={[sourceId]}
          key={sourceId}
          id={sourceId}
        />
      </PageMock>
    </Wrapper>
  )
}

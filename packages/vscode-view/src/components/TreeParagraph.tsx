import { Tree } from '@forten/tree-view'
import { ParagraphProps } from '@pawi/editor'
import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'
import { TreeData } from '../types'

export type TreeParagraphProps = ParagraphProps<TreeData>

const Wrapper = styled.div`
  border-radius: 3px;
  background: #444;
  padding: 5px;
  &&& .CodeMirror {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`

export const TreeParagraph: Comp<TreeParagraphProps> = ({ data, holder }) => {
  useOvermind()
  return (
    <Wrapper>
      <Tree tree={data} extraProps={{ holder }} />
    </Wrapper>
  )
}

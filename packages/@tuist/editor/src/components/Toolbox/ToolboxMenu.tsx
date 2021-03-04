import * as React from 'react'

import { Comp, styled, useOvermind } from '../../app'
import { Icon, Tip } from '@tuist/styled'

import { CompositionHolder } from '../../lib'
import { OperationsKey } from '../../lib/doOperation'
import { ParagraphPayload } from '../../lib/utils/types'
import classnames from 'classnames'
import { getAtPath } from '../../lib/utils/getAtPath'
import { getSelection } from '../helpers/getSelection'

interface ParagraphProps {
  className?: string
  type: 'paragraph' | 'emptyParagraph' | 'selection'
  holder: CompositionHolder
  compId: string
}

const ToolIcon = styled(Icon)`
  margin: 0;
`
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 160px;
  & .item {
    padding: 6px 8px;
    border-radius: 2px;
    cursor: pointer;
  }

  & .item.selected {
    background: #ddd;
    border-radius: 0;
    border-bottom: 3px solid #6f6a62;
  }

  & .item i {
    font-style: normal;
  }

  & .item .heading {
    font-weight: bold;
  }

  & .item .para {
    font-size: 90%;
  }
`

export const ToolboxMenu: Comp<ParagraphProps> = ({
  className,
  type,
  holder,
  compId,
}) => {
  const app = useOvermind()
  const { applyOp } = app.actions.editor
  const options = app.state.editor.options()
  function click(
    e: React.MouseEvent<HTMLDivElement>,
    op: OperationsKey,
    opts: ParagraphPayload
  ) {
    const selection = getSelection(compId)
    if (selection) {
      applyOp({ holder, op, selection, opts })
    }
    e.preventDefault()
  }
  const { composition } = holder
  if (!composition) {
    return null
  }
  const { spath } = composition
  const elem = spath
    ? getAtPath(composition, spath.split('.'), true)
    : undefined
  const elemType = elem ? JSON.stringify({ o: elem.o ? elem.o : {} }) : ''

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  return (
    <Wrapper className={classnames(className, 'menu')}>
      {options
        .getMenuChoices(type)
        .map(({ op, icon, toolboxComponent, payload }, idx) => (
          <div
            className={classnames('item', { selected: elemType === payload })}
            key={idx}
            onClick={e => click(e, op, JSON.parse(payload))}
            onMouseDown={onMouseDown}
          >
            {typeof toolboxComponent === 'string' ? (
              <Tip tip={`tip${toolboxComponent}Icon`}>
                <span>{toolboxComponent}</span>
              </Tip>
            ) : (
              toolboxComponent || (icon ? <ToolIcon tip icon={icon} /> : '??')
            )}
          </div>
        ))}
    </Wrapper>
  )
}

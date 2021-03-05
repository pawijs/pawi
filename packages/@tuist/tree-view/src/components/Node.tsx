import { reference } from '@tuist/build'
import { draggable } from '@tuist/dragdrop'
import classnames from 'classnames'
import * as React from 'react'
import { TreeType } from 'tuist'
import { Comp, useOvermind } from '../app'
import { TreeDrag, UINodeType, UISlotType } from '../types'

const DUMMY_GRAPH: TreeType = {
  id: 'dummy',
  version: '',
  type: 'dummy',
  entry: 'foo',
  blocks: {
    foo: {
      id: 'foo',
      name: 'foo',
      children: [],
      content: null,
    },
  },
}

export interface NodeProps {
  className?: string
  tree: TreeType
  uinode: UINodeType
  noDrop?: boolean
}

const makeSlot = (nodeId: string, slot: UISlotType, sclick: any) => {
  const flags = slot.flags
  const { x, y } = slot.pos
  const klass = ['slot', ...Object.keys(flags)].join(' ')
  const transform = `translate(${x}, ${y})`
  const spath =
    flags.detached || flags.incompatible ? (
      <path d={slot.path} className={klass} />
    ) : (
      ''
    )

  return (
    <g key={slot.idx} transform={transform}>
      {spath}
      <g className="sclick" data-nodeid={nodeId} data-slotidx={slot.idx}>
        <path
          d={slot.click}
          onClick={e => sclick(e, slot.idx)}
          className="click"
        />
        <path d={slot.plus} className="plus" />
      </g>
    </g>
  )
}

function propsAreEqual(prevProps: NodeProps, nextProps: NodeProps) {
  return prevProps.uinode === nextProps.uinode
}

export const Node: Comp<NodeProps> = React.memo(({ tree, uinode, noDrop }) => {
  const ctx = useOvermind()

  // FIXME: WHY ARE SUB CHILDREN NOT REDRAWN ON DROP ?
  // Position in parent
  const x = uinode.pos.x
  const y = uinode.pos.y
  const transform = `translate(${x},${y})`

  const klass = {
    [uinode.className]: true,
    invalid: uinode.invalid,
    closed: uinode.closed,
    node: true,
  }

  const arrowclick = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation()

    ctx.actions.tree.setClosed({
      nodeId: uinode.id,
      tree,
      closed: !uinode.closed,
    })
  }

  const slotclick = (e: React.MouseEvent<SVGElement>, slotIdx: number) => {
    e.stopPropagation()

    ctx.actions.tree.add({
      slotIdx,
      parentId: uinode.id,
      tree,
    })
  }
  const uiArrow = uinode.arrow

  const onClick = () =>
    ctx.actions.tree.selectNode({ tree, id: uinode.id, editName: false })
  const dragProps = noDrop
    ? {}
    : tree.entry === uinode.id
    ? {
        onClick,
      }
    : draggable<TreeDrag>(ctx, {
        drag: 'tree',
        payload: {
          origin: reference(tree),
          // Dummy value replaced in 'start' hook.
          tree: DUMMY_GRAPH,
          nodeId: uinode.id,
        },
        enable: uinode.className !== 'main',
        onClick,
      })

  const selected = tree.selected && tree.selected.id === uinode.id
  return (
    <g transform={transform}>
      <path
        d={uinode.path}
        className={classnames(klass, {
          selected,
        })}
        {...dragProps}
      />
      {uinode.invalid ? (
        <path d={uinode.invalidPath} className="invalidMark" />
      ) : null}
      <text x={uinode.size.tx} y={uinode.size.ty} className={classnames(klass)}>
        {uinode.name}
      </text>
      <path d={uiArrow.path} className={classnames(uiArrow.class)} />
      <path d={uiArrow.click} onClick={arrowclick} className="arrowclick" />
      {uinode.slots.map(s => makeSlot(uinode.id, s, slotclick))}
    </g>
  )
}, propsAreEqual)

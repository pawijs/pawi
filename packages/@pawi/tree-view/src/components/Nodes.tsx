import classnames from 'classnames'
import { TreeType } from 'pawi'
import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'
import { KEY_ACTIONS } from '../helpers'
import { TreeDrag, UITreeType } from '../types'
import { DropTarget } from './DropTarget'
import { Node } from './Node'
import { TreeSVG } from './TreeSVG'

export interface NodesProps {
  className?: string
  tree: TreeDrag['tree']
  // Prevent dragged element as behaving like a drop zone.
  noDrop?: boolean
  // Only draw part of the Tree
  nodeId?: string
}

const Wrapper = styled.div`
  &:focus {
    outline: none;
  }
  position: relative;
  padding: 0;
  flex-grow: 1;
  overflow: auto;
  font-size: 12pt;
  font-family: 'Avenir Next';
`

const mapUINodes = (tree: TreeType, uigraph: UITreeType, noDrop?: boolean) => {
  const nodes = uigraph.nodes
  const uiNodeById = uigraph.uiNodeById

  return nodes.map(n => {
    const uinode = uiNodeById[n]
    // We pass the reference as a string to enable caching
    return <Node tree={tree} key={n} uinode={uinode} noDrop={noDrop} />
  })
}

function propsAreEqual(prevProps: NodesProps, nextProps: NodesProps) {
  return prevProps.tree.version === nextProps.tree.version
}

export const Nodes: Comp<NodesProps> = React.memo(
  ({ className, noDrop, tree }) => {
    const ctx = useOvermind()
    const ref = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {
      if (tree.selected) {
        if (!tree.selected.editName) {
          if (ref.current) {
            ref.current.focus()
          }
        }
      }
    }, [tree.selected])

    if (!tree) {
      return null
    }

    const treeId = tree.id
    const dropTarget = ctx.state.treeView.dropTarget[treeId]
    const uitree = ctx.state.treeView.uimap[treeId]
    if (!uitree) {
      ctx.actions.treeView.uimap({ tree })
      return null
    } else if (uitree.version !== tree.version) {
      ctx.actions.treeView.uimap({ tree: tree })
      return null
    }

    // TODO: implement scale change with slider
    // in the status bar.
    const transform = `scale(1.0)` // ${$scale})`

    const uidropnode = dropTarget
      ? uitree.uiNodeById[dropTarget.nodeId]
      : undefined
    if (dropTarget && !uidropnode) {
      console.log(
        `Invalid droptarget nodeId ?? ${
          // @ts-ignore
          dropTarget.nodeId
        }: not present in tree nodes [${Object.keys(uitree.uiNodeById).join(
          ' ,'
        )}].`
      )
    }

    function onKeyDown(e: React.KeyboardEvent<any>) {
      const action = KEY_ACTIONS[e.key]
      if (action) {
        e.stopPropagation()
        e.preventDefault()
        const { selected } = tree
        if (selected) {
          const uinode = uitree.uiNodeById[selected.id]
          if (!uinode) {
            // This can happen for selected nodes in closed branch
            return
          }
          action(ctx, tree, selected, uinode.parent, e)
        } else {
          // select root
          ctx.actions.tree.selectNode({ id: tree.entry, tree, editName: false })
        }
      } else {
        // console.log(e.key)
      }
    }

    return (
      <Wrapper
        ref={ref as any}
        className={classnames(className, 'Graph')}
        onKeyDown={onKeyDown}
        tabIndex={-1}
      >
        <TreeSVG
          id={treeId}
          className={
            // This classname is used to find all compatible graphs for drop operation on
            // page. If this is the tree that is dragged, we do not want it to be 'dropped' on.
            noDrop ? undefined : `tree-${tree.type}`
          }
          width={uitree.size.width}
          height={uitree.size.height}
        >
          <g transform={transform}>
            {mapUINodes(tree, uitree, noDrop)}
            {uidropnode && dropTarget ? (
              <DropTarget
                key="DropTarget"
                uinode={uidropnode}
                slotIdx={dropTarget.slotIdx}
              />
            ) : null}
          </g>
        </TreeSVG>
      </Wrapper>
    )
  },
  propsAreEqual
)

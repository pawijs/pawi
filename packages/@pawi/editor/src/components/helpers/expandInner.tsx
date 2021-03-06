import { Page, PageContent, PageHeader, Resizable } from '@pawi/styled'
import * as React from 'react'
import styled from 'styled-components'
import { ElementTagType } from '..'
import { Comp, useOvermind } from '../../app'
import { ElementsType } from '../../lib'
import {
  ElementOptionsType,
  ElementSizes,
  GroupElementType,
} from '../../lib/utils/types'
import { EditorProps } from '../Editor'
import { ElementTag } from '../ElementTag'
import { Footer } from '../Footer'

interface ElemIdWithStart {
  id: string
  u?: ElementOptionsType['u']
  l?: ElementOptionsType['l']
  start: number
}

function groupByPage(
  pageHeight: number,
  inner: ElementsType,
  sizes: ElementSizes
): ElemIdWithStart[][] {
  const pages: ElemIdWithStart[][] = []
  let currentPage: ElemIdWithStart[]
  // Force a new page on first element
  // left (or default column)
  let acc_l = 0
  let bottom_l = 0
  // right column
  let acc_r = 0
  let bottom_r = 0
  // Bottom margin of the previous element
  let listStart = 0
  Object.keys(inner)
    .sort((a, b) => inner[a].p - inner[b].p)
    .forEach((key, idx) => {
      if (key) {
        const elem = inner[key]
        const o: ElementOptionsType = elem.o || {}
        const { l, u } = o
        if (l === 'ol') {
          // ordered list: keep numbering across pages
          listStart += 1
        } else {
          listStart = 0
        }

        // If size is not known, use 0. This will be updated
        // on initial render.
        const size = sizes[key]
        const height = size
          ? size.c + Math.max(size.t, u === 'r' ? bottom_r : bottom_l)
          : 0
        if (u === 'r') {
          bottom_r = size ? size.b : 0
        } else {
          bottom_l = size ? size.b : 0
        }
        const acc = (u === 'r' ? acc_r : acc_l) + height
        if (!currentPage || (pageHeight && (acc > pageHeight || o.n))) {
          // start new page
          currentPage = []
          pages.push(currentPage)
          acc_l = 0
          acc_r = 0
        }
        currentPage.push({ id: key, start: listStart, l, u })
        if (u === 'r') {
          acc_r += height
        } else {
          acc_l += height
        }
      }
    })

  return pages
}

const SmallPage = styled(Page)`
  min-height: auto;
`

// TODO: Memo ?
export const RegionComp: Comp<{
  region: Region
  editorProps: EditorProps
  compId: string
}> = ({ region, editorProps, compId }) => {
  if (region.columns[0].u) {
    return (
      <div className="Columns">
        {region.columns.map((column, idx) => (
          <ColumnComp
            resize={idx === 0}
            column={column}
            key={column.u}
            editorProps={editorProps}
            compId={compId}
          />
        ))}
      </div>
    )
  } else {
    const column = region.columns[0]
    return (
      <ColumnComp
        column={column}
        key={column.u}
        editorProps={editorProps}
        compId={compId}
      />
    )
  }
}

// TODO: Memo ?
export const ColumnComp: Comp<{
  column: Column
  editorProps: EditorProps
  compId: string
  resize?: boolean
}> = ({ column, editorProps, compId, resize }) => {
  const ctx = useOvermind()
  const className = column.u ? `Column Column_${column.u}` : undefined
  if (resize) {
    const sizeId = column.lists[0].ids[0]
    const comp = editorProps.holder.composition
    const width = (comp && comp.g[sizeId].o?.uw) || 160
    return (
      <Resizable
        top
        type="width"
        className={className}
        width={width}
        step={40}
        onResize={({ width }) => {
          ctx.actions.editor.setOption({
            id: sizeId,
            holder: editorProps.holder,
            key: 'uw',
            value: width,
          })
        }}
      >
        {column.lists.map(list => (
          <ListComp
            list={list}
            key={list.ids[0]}
            editorProps={editorProps}
            compId={compId}
          />
        ))}
      </Resizable>
    )
  } else if (column.u) {
    return (
      <div className={className}>
        {column.lists.map(list => (
          <ListComp
            list={list}
            key={list.ids[0]}
            editorProps={editorProps}
            compId={compId}
          />
        ))}
      </div>
    )
  } else {
    return (
      <React.Fragment>
        {column.lists.map(list => (
          <ListComp
            list={list}
            key={list.ids[0]}
            editorProps={editorProps}
            compId={compId}
          />
        ))}
      </React.Fragment>
    )
  }
}

// TODO: Memo ?
export const ListComp: Comp<{
  list: List
  editorProps: EditorProps
  compId: string
}> = ({ list, editorProps, compId }) => {
  if (list.l) {
    const Tag = list.l
    return (
      <Tag start={list.start}>
        {list.ids.map(id => (
          <ElementTag
            key={id}
            id={id}
            editorProps={editorProps}
            // We pass `holder` directly because of tracking that needs
            // to detect state stuff in props and we should not hide it
            // inside another object.
            holder={editorProps.holder}
            compId={compId}
            isParagraph
            path={[id]}
          />
        ))}
      </Tag>
    )
  } else {
    return (
      <React.Fragment>
        {list.ids.map(id => (
          <ElementTag
            key={id}
            id={id}
            editorProps={editorProps}
            // We pass `holder` directly because of tracking that needs
            // to detect state stuff in props and we should not hide it
            // inside another object.
            holder={editorProps.holder}
            compId={compId}
            isParagraph
            path={[id]}
          />
        ))}
      </React.Fragment>
    )
  }
}

interface List {
  // list type
  l?: ElementOptionsType['l']
  start: number
  ids: string[]
}

interface Column {
  // last list type (used during compilation)
  l?: ElementOptionsType['l']
  // column type
  u?: ElementOptionsType['u']
  lists: List[]
}

interface Region {
  // last column type (used during compilation)
  u?: ElementOptionsType['u']
  columns: Column[]
}

// FIXME PERFORMANCE: THIS SHOULD BE CACHED IN COMPOSITION and updated
// on paragraph operations and o.l or o.u changes.
// Not this, the result from this and pagination call.
function groupByList(ids: ElemIdWithStart[]): Region[] {
  const regions: Region[] = []
  let region: Region | undefined
  let column: Column | undefined
  let list: List | undefined
  ids.forEach(({ id, start, u, l }) => {
    if (!region || (region.u !== u && u !== 'r')) {
      // new page or next region (end of last column)
      region = { columns: [] }
      if (u === 'r') {
        // Ensure that things jumping pages stay on right side
        // (this avoids list being rendered with different width and
        // thus height and unstable pagination).
        region.columns.push({ u: 'l', lists: [] })
      }
      regions.push(region)
      column = undefined
      list = undefined
    }

    if (!column || (u === 'r' && region.u === 'l')) {
      // new region or next column
      column = { u, lists: [] }
      list = undefined
      region.u = u
      region.columns.push(column)
    }

    if (!list || column.l !== l) {
      // new column or next list
      list = { l, start, ids: [] }
      column.l = l
      column.lists.push(list)
    }
    list.ids.push(id)
  })
  return regions
}

export function expandPages(
  ElementTag: ElementTagType,
  editorProps: EditorProps & { children?: any },
  pageSize: number,
  sizes: ElementSizes,
  compId: string,
  firstOnly?: boolean
): JSX.Element[] {
  const Head = editorProps.header || PageHeader
  const Foot = editorProps.footer || Footer
  const children = editorProps.children

  if (!editorProps.holder.composition) {
    const PageComp = children ? SmallPage : Page
    return [
      <PageComp key={0} className="Page">
        <Head page={1} pageCount={1} holder={editorProps.holder} />
        <PageContent className="Content">
          <ElementTag
            editorProps={editorProps}
            holder={editorProps.holder}
            isParagraph
            compId={compId}
            // WHAT IS THIS ?
            path={['']}
            key={''}
            // Special ref for empty composition
            id={'titleOnly'}
          />
        </PageContent>
        <Foot page={1} pageCount={1} holder={editorProps.holder} />
      </PageComp>,
    ]
  }
  const inner = editorProps.holder.composition.g
  // const pages = groupByPage(0, inner, sizes)
  const pages = groupByPage(firstOnly ? 1400 : pageSize, inner, sizes)
  const list = firstOnly ? [pages[0]] : pages
  return list.map((page, idx) => {
    const PageComp = children && idx === pages.length - 1 ? SmallPage : Page
    return (
      <PageComp key={idx} className="Page">
        <Head
          page={idx + 1}
          pageCount={pages.length}
          noPagination={firstOnly || pageSize === 0}
          holder={editorProps.holder}
        />
        <PageContent className="Content">
          {groupByList(page).map((region, idx) => (
            <RegionComp
              key={idx}
              region={region}
              editorProps={editorProps}
              compId={compId}
            />
          ))}
        </PageContent>
        <Foot
          page={idx + 1}
          pageCount={pages.length}
          noPagination={pageSize === 0}
          holder={editorProps.holder}
        />
      </PageComp>
    )
  })
}

export function expandInner(
  editorProps: EditorProps,
  group: GroupElementType,
  path: string[],
  compId?: string
): JSX.Element[] {
  const { g } = group
  return Object.keys(group.g || {})
    .sort((a, b) => g[a].p - g[b].p)
    .map(id => {
      if (id) {
        return (
          <ElementTag
            key={id}
            id={id}
            editorProps={editorProps}
            holder={editorProps.holder}
            compId={compId}
            isParagraph={false}
            path={[...path, id]}
          />
        )
      } else {
        // Empty key, will be cleaned up on next save
        return <div />
      }
    })
}

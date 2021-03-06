import { CompositionHolder, isCustomElement } from './types'

import { Context } from '../../app'
import { SortAscending } from './getNeighbours'

export interface CustomParagraphInfo {
  icon: string
  title: string
  id: string
  data: any
  type: string
  exported?: boolean
}

export function customParagraphs(
  ctx: {
    state: {
      editor: Context['state']['editor']
    }
  },
  holder: CompositionHolder
): CustomParagraphInfo[] {
  const opts = ctx.state.editor.options()
  const { composition } = holder
  if (!composition) {
    return []
  }
  const list: CustomParagraphInfo[] = []
  const { g, data } = composition
  if (!data) {
    return []
  }
  SortAscending(g).forEach(id => {
    const elem = g[id]
    if (isCustomElement(elem)) {
      const paraData = data[id]
      if (!paraData) {
        return
      }
      const settings = opts.paragraphs[elem.c]
      if (settings && settings.icon && settings.getInfo) {
        const info = settings.getInfo(ctx, paraData)
        if (info) {
          list.push({
            icon: info.icon,
            id,
            title: info.title,
            type: elem.c,
            data: paraData,
            exported: elem.o && elem.o.e,
          })
        }
      }
    }
  })
  return list
}

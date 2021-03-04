import { CompositionType, ElementsType, isGroupElement } from './utils/types'
import { makeRef } from './utils/makeRef'

function getIds(elem: { g: ElementsType }, allIds: { [id: string]: boolean }) {
  Object.keys(elem.g).forEach(key => {
    allIds[key] = true
    const child = elem.g[key]
    if (isGroupElement(child)) {
      getIds(child, allIds)
    }
  })
  return allIds
}

function mapGroupIds(
  allIds: { [id: string]: boolean },
  elem: { g: ElementsType },
  data?: { [id: string]: any }
) {
  Object.keys(elem.g).forEach(key => {
    const child = elem.g[key]
    if (allIds[key]) {
      delete elem.g[key]
      const newKey = makeRef()
      elem.g[newKey] = child
      if (data && data[key]) {
        data[newKey] = data[key]
        delete data[key]
      }
    }
    if (isGroupElement(child)) {
      mapGroupIds(allIds, child)
    }
  })
}

// Replace element ids in place for 'source' based on existing ids in
// target
export function mapIds(target: CompositionType, source: CompositionType) {
  mapGroupIds(getIds(target, {}), source, source.data)
  return source
}

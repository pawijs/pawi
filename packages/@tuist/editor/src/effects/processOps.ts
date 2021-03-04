import { CompositionType, isGroupElement } from '../lib'
import {
  CompositionWrapper,
  GroupElementType,
  ProcessOpsArgs,
  SelectOperationType,
  isCustomElement,
  isRangeSelection,
  isStringElement,
} from '../lib/utils/types'

import { getAtPath } from '../lib/utils/getAtPath'
import { getNeighbours } from '../lib/utils/getNeighbours'

function getParent(
  composition: CompositionType,
  path: string[]
): GroupElementType | undefined {
  const elem = getAtPath(composition, path.slice(0, -1), true)
  if (!elem) {
    return undefined
  } else if (isGroupElement(elem)) {
    return elem
  } else {
    console.log(`Cannot update element at path '${path}' (not a group).`)
    return undefined
  }
}

export function processSelect(
  composition: CompositionType,
  op: SelectOperationType
) {
  const selection = op.value
  const path = selection.anchorPath.join('.')
  const oldPath = composition.spath
  if (oldPath !== path) {
    if (oldPath) {
      const oldElem = getAtPath(composition, oldPath.split('.'), true)
      if (oldElem) {
        delete oldElem.s
        if (oldElem.o && oldElem.o.open) {
          delete oldElem.o.open
          if (Object.keys(oldElem.o).length === 0) {
            delete oldElem.o
          }
        }
      }
    }
    composition.spath = path
  }
  let elem = getAtPath(composition, selection.anchorPath, true)

  if (elem && elem.t === 'E') {
    console.error('FIXME: THIS SHOULD NEVER HAPPEN')
    // Make sure we never select a <BR/> element
    // Forced line break: get next element
    const [, nextElem] = getNeighbours(composition, selection.anchorPath, true)
    if (!nextElem) {
      // Create a new empty element inside parent and select it
      return
    } else {
      selection.anchorOffset = 1
      selection.anchorPath = nextElem.path
      selection.type = 'Caret'
      elem = nextElem.elem
    }
  }

  if (elem) {
    const startPara = composition.g[selection.anchorPath[0]]
    const endPara = isRangeSelection(selection)
      ? composition.g[selection.focusPath[0]]
      : startPara
    composition.smin = startPara.p
    composition.smax = endPara.p
    elem.s = op.value
    if (
      selection.anchorPath.length > 1 &&
      isStringElement(elem) &&
      elem.i === ''
    ) {
      if (op.value.anchorOffset === 0) {
        elem.s!.anchorOffset = 1
      }
    }
  }
}

/** This is just while code is unstable, to hack around bugs.
 * FIXME: REMOVE WHEN MORE STABLE
 */
function sanitize(comp: CompositionType) {
  let p = 1
  const list = Object.keys(comp.g)
    .map(key => ({ id: key, elem: comp.g[key] }))
    .sort((a, b) => a.elem.p - b.elem.p)
    .filter(({ id, elem }) => {
      if (isGroupElement(elem)) {
        if (Object.keys(elem.g).length === 0) {
          console.warn('Editor BUG: Empty group.')
          delete comp.g[id]
          return false
        }
      }
      return true
    })
  list.forEach(({ id, elem }, idx) => {
    // Check 'p' bugs.
    if (elem.p === p) {
      console.warn('Editor BUG: ordering error.')
      const next = list[idx + 1]
      p = next ? (p + next.elem.p) / 2 : p + 1
      comp.g[id].p = p
    } else {
      p = elem.p
    }
  })
}

export function processOps(args: ProcessOpsArgs) {
  const { ops, holder } = args
  if (!ops) {
    return
  }
  const { composition } = holder as CompositionWrapper
  ops.forEach(op => {
    switch (op.op) {
      case 'update':
        {
          const elem = getParent(composition, op.path)
          const last = op.path.slice(-1)[0]
          if (elem) {
            elem.g[last] = op.value
          }
        }
        break
      case 'updateOpts':
        {
          const opts = op.opts
          const elem = getAtPath(composition, op.path)
          if (elem) {
            if (opts.o) {
              elem.o = opts.o
            } else {
              delete elem.o
            }
            if (opts.c) {
              elem.c = opts.c
            } else {
              delete elem.c
            }
          }
        }
        break
      case 'delete':
        {
          const elem = getParent(composition, op.path)
          const id = op.path.slice(-1)[0]
          if (elem) {
            const oldElem = elem.g[id]
            delete elem.g[id]
            if (isCustomElement(oldElem) && composition.data) {
              delete composition.data[id]
            }
          }
        }
        break
      case 'data':
        if (!composition.data) {
          composition.data = {}
        }
        composition.data[op.path[0]] = op.data
        break
      case 'resized':
        {
          if (composition.sz) {
            delete composition.sz[op.id]
          }
        }
        break
      case 'select':
        processSelect(composition, op)
        break
      case 'toolbox':
        {
          if (op.value) {
            composition.toolbox = op.value
          } else {
            delete composition.toolbox
          }
        }
        break
    }
  })
  sanitize(composition)
}

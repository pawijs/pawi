import { describe, expect, it } from 'test'
import { insertComposition } from './insertComposition'
import { caretSelection } from './utils/caretSelection'
import { mockComposition, mockRef } from './utils/testUtils'
import {
  CompositionType,
  GroupElementType,
  SelectionType,
  StringElementType,
} from './utils/types'

const composition = mockComposition()

const para2 = composition.g.para2 as GroupElementType
const span22 = para2.g.span22 as StringElementType
const para3 = composition.g.para3 as StringElementType
const simpleP: StringElementType = { t: 'P', p: 0, i: 'Some new text.' }
const groupP = {
  t: 'P',
  p: 1,
  g: {
    g1: { t: 'T', p: 0, i: 'How does ' },
    g2: { t: 'B', p: 1, i: 'bold ' },
    g3: { t: 'T', p: 2, i: 'work ?' },
  },
}
const g1 = groupP.g.g1
const g2 = groupP.g.g2
const g3 = groupP.g.g3

const simpleComp: CompositionType = {
  g: {
    simpleP,
  },
}

const groupComp: CompositionType = {
  g: {
    groupP,
  },
}

/*
const twoParaComp: CompositionType = {
  g: {
    groupP,
    simpleP,
  },
}
*/

function testInsertion(selection: SelectionType, source: CompositionType) {
  const changes = insertComposition(composition, selection, source)
  return Object.values(changes.elements)
    .filter(({ op }) => op !== 'noop')
    .sort((a, b) => {
      return a.path[0] === b.path[0]
        ? a.path.length === b.path.length
          ? a.elem.p - b.elem.p
          : a.path.length - b.path.length
        : a.path[0] > b.path[0]
          ? 1
          : -1
    })
}

describe('insertComposition', () => {
  it('should insert text inside text', () => {
    expect(testInsertion(caretSelection(['para3'], 8), simpleComp)).toEqual([
      {
        op: 'update',
        path: ['para3'],
        pathId: 'para3',
        elem: Object.assign({}, para3, {
          i: para3.i.slice(0, 8) + simpleP.i + para3.i.slice(8),
        }),
      },
    ])
  })

  it('should insert group inside text', () => {
    mockRef()
    expect(testInsertion(caretSelection(['para3'], 8), groupComp)).toEqual([
      {
        op: 'update',
        pathId: 'para3',
        path: ['para3'],
        elem: { g: {}, p: para3.p, t: 'P' },
      },
      {
        op: 'create',
        pathId: 'para3.refe1',
        path: ['para3', 'refe1'],
        elem: Object.assign({}, para3, {
          p: 0,
          t: 'T',
          i: para3.i.slice(0, 8) + g1.i,
        }),
      },
      {
        op: 'create',
        pathId: 'para3.g2',
        path: ['para3', 'g2'],
        elem: Object.assign({}, g2, {
          p: 3,
        }),
      },
      {
        op: 'create',
        pathId: 'para3.g3',
        path: ['para3', 'g3'],
        elem: Object.assign({}, groupP.g.g3, {
          p: 4,
          i: groupP.g.g3.i + para3.i.slice(8),
        }),
      },
    ])
  })

  it('should insert text inside group', () => {
    expect(
      testInsertion(caretSelection(['para2', 'span22'], 3), simpleComp)
    ).toEqual([
      {
        op: 'update',
        pathId: 'para2.span22',
        path: ['para2', 'span22'],
        elem: Object.assign({}, span22, {
          i: span22.i.slice(0, 3) + simpleP.i + span22.i.slice(3),
        }),
      },
    ])
  })

  it('should insert group inside group', () => {
    mockRef()
    const result = testInsertion(
      caretSelection(['para2', 'span22'], 3),
      groupComp
    )
    const positions = result.map(r => r.elem.p)
    expect(result).toEqual([
      {
        // 'para2.span22(0-3):B',
        op: 'update',
        pathId: 'para2.span22',
        path: ['para2', 'span22'],
        elem: Object.assign({}, span22, {
          p: 1,
          i: span22.i.slice(0, 3),
        }),
      },
      {
        // 'para2.g1:T',
        op: 'create',
        pathId: 'para2.g1',
        path: ['para2', 'g1'],
        elem: Object.assign({}, g1, {
          p: positions[1],
        }),
      },
      {
        // 'para2.g2:B + para2.span22(3-):B',
        op: 'create',
        pathId: 'para2.g2',
        path: ['para2', 'g2'],
        elem: Object.assign({}, g2, {
          p: positions[2],
        }),
      },
      {
        // 'para2.g3:T + para2.span23:T',
        op: 'create',
        pathId: 'para2.g3',
        path: ['para2', 'g3'],
        elem: Object.assign({}, g3, {
          p: positions[3],
        }),
      },
      {
        op: 'create',
        pathId: 'para2.refe2',
        path: ['para2', 'refe2'],
        elem: Object.assign({}, span22, {
          p: positions[4],
          i: span22.i.slice(3),
        }),
      },
    ])
  })
})

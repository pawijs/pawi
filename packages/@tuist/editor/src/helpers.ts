import { CompositionHolder } from './lib'
import { SortAscending } from './lib/utils/getNeighbours'

export function parseCustomData<T>(
  holder: CompositionHolder,
  type: string,
  clbk: (data: T) => void
) {
  const { composition } = holder
  if (!composition) {
    return
  }

  const { g, data } = composition
  if (!data) {
    return
  }

  SortAscending(g).forEach(paraId => {
    const elem = g[paraId]
    if (elem.c === type) {
      const paraData = data[paraId]
      if (paraData) {
        clbk(paraData)
      }
    }
  })
}

import { CompositionType, StringElementType } from './utils/types'

export function getTitleElem(
  composition: CompositionType
): StringElementType | undefined {
  for (const key in composition.g) {
    const elem = composition.g[key]
    if (elem.o && elem.o.title) {
      return elem as StringElementType
    }
  }
  return undefined
}

export function getTitle(composition: CompositionType): string | undefined {
  const elem = getTitleElem(composition)
  return elem ? elem.i : undefined
}

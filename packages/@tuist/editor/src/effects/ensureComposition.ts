import { CompositionHolder, CompositionType, newComposition } from '../lib'

export function ensureComposition(holder: CompositionHolder) {
  if (!holder.composition) {
    holder.composition = newComposition({
      title: holder.title || true,
      select: true,
    })
  }
  return holder.composition as CompositionType
}

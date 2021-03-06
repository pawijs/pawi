import { CompositionHolder } from '../lib'

export function clearToolbox(holder: CompositionHolder) {
  if (holder.composition!.toolbox) {
    delete holder.composition!.toolbox
  }
}

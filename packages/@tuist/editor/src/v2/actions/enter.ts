import { applyStyle, newParagraph } from '../mutations'

import { CommandEvent } from '@tuist/shortcuts'
import { Mutation } from '../types'

export function enter(m: Mutation, e: CommandEvent) {
  if (e.shiftKey) {
    return applyStyle(m, 'E')
  } else {
    return newParagraph(m)
  }
}

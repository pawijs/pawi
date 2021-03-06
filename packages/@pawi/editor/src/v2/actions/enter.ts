import { CommandEvent } from '@pawi/shortcuts'
import { applyStyle, newParagraph } from '../mutations'
import { Mutation } from '../types'

export function enter(m: Mutation, e: CommandEvent) {
  if (e.shiftKey) {
    return applyStyle(m, 'E')
  } else {
    return newParagraph(m)
  }
}

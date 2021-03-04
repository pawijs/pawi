import { ElementType } from '../../lib'

export function getElementTag(
  { t, o }: ElementType,
  isParagraph: boolean = false
) {
  switch (t) {
    case 'P':
      if (o) {
        if (o.h) {
          return `h${o.h}` as 'h1' | 'h2' | 'h3'
        } else if (o.l) {
          return 'li'
        } else if (o.u) {
          return 'div'
        } else {
          return 'p'
        }
      } else {
        return 'p'
      }
    case 'A':
      return 'a'
    case 'E':
      return 'br'
    default:
      return isParagraph ? 'p' : 'span'
  }
}

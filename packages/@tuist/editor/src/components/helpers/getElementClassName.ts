import { ElementType, isDocumentTitle } from '../../lib'

const OP_TO_CLASS: { [op: string]: string } = {
  B: 'strong',
  I: 'em',
  E: '',
}

export function getElementClassName(elem: ElementType, className?: string) {
  if (elem.t === 'P') {
    const classes: string[] = []
    if (className) {
      classes.push(className)
    }
    if (isDocumentTitle(elem)) {
      classes.push('Title')
    }
    if (elem.i === '') {
      classes.push('Empty')
    }
    const o = elem.o || {}
    const { a } = o
    if (a) {
      classes.push(`align_${a}`)
    }
    return classes.join(' ')
  } else if (elem.t === 'E') {
    return
  } else {
    return elem.t
      .split('+')
      .map(op => OP_TO_CLASS[op])
      .join(' ')
  }
}

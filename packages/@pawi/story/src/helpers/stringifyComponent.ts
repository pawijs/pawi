import { IS_PROXY, PATH } from 'proxy-state-tree'
import { Comp } from '../app'

function serialize(value: any) {
  if (value === undefined) {
    return `={undefined}`
  } else if (value === null) {
    return `={null}`
  } else if (value[IS_PROXY]) {
    return `={app.state.${value[PATH]}}`
  } else if (typeof value === 'string') {
    return `="${value.replace(/"/g, '\\"')}"`
  } else if (value === true) {
    return ''
  } else if (typeof value === 'function') {
    return `={function ${value.name}}`
  } else {
    return `={${JSON.stringify(value)}}`
  }
}

const NAME_RE = /^(Styled\()?([a-zA-Z]+)\)?$/

function getCompName(comp: Comp | string) {
  if (typeof comp === 'string') {
    return comp
  }
  const name =
    comp.displayName ||
    comp.name ||
    /* istanbul ignore next */
    'Component'
  const re = NAME_RE.exec(name)
  // Cerebral wraps components with CerebralWrapping_[name]
  // Styled comp wraps with Styled([name])
  /* istanbul ignore else */
  if (re) {
    return re[2]
  }
  // Unreachable code
  /* istanbul ignore next */
  return name
}

function showProps(props: any) {
  return Object.keys(props)
    .filter(k => k !== 'children')
    .map((k, idx) => `${idx === 0 ? ' ' : ''}${k}${serialize(props[k])}`)
    .join(' ')
}

interface Element {
  type: string
  props: any
}

export function parseComponent(
  result: string[],
  indent: string,
  elem: Element | string
) {
  if (typeof elem === 'string' || typeof elem === 'number') {
    result.push(`${indent}${elem}`)
    return
  } else if (typeof elem === 'function') {
    // This is not JSX: it's an error.
    throw new Error(`Invalid child: not a JSX element: ${elem}.`)
  }
  const { type, props } = elem
  const name = getCompName(type)
  const { children } = props || /* istanbul ignore next */ {
    children: undefined,
  }
  result.push(`${indent}<${name}${showProps(props)}`)
  if (typeof children === 'string') {
    result[result.length - 1] =
      result[result.length - 1] + `>${children}</${name}>`
  } else if (children) {
    result[result.length - 1] = result[result.length - 1] + '>'
    if (Array.isArray(children)) {
      children.forEach(child => {
        parseComponent(result, indent + '  ', child)
      })
    } else {
      parseComponent(result, indent + '  ', children)
    }
    result.push(`${indent}</${name}>`)
  } else {
    result[result.length - 1] = result[result.length - 1] + ' />'
  }
}

export function stringifyComponent(comp: Comp, props: any = {}) {
  const result: string[] = []
  parseComponent(result, '', { type: getCompName(comp), props })
  return result.join('\n')
}

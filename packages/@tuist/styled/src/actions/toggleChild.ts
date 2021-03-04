import { Action } from '../app'

export const toggleChild: Action<{
  family: string
  child: string
  exclusive?: boolean
}> = (ctx, { family, child, exclusive }) => {
  const { show } = ctx.state.styled
  if (!show[family]) {
    show[family] = { [child]: true }
  } else if (exclusive) {
    show[family] = show[family][child] ? {} : { [child]: true }
  } else {
    show[family][child] = !show[family][child]
  }
}

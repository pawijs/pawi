import { Action } from '../app'
import { CompositionHolder } from '../lib'

export interface DataChangeArgs {
  data: { [key: string]: any }
  values: { [key: string]: any }
  holder: CompositionHolder
}

export const dataChange: Action<DataChangeArgs> = (
  ctx,
  { data, values, holder }
) => {
  Object.keys(values).forEach(key => {
    if (data[key] === values[key]) {
      delete data[key]
    } else {
      data[key] = values[key]
    }
  })
  ctx.actions.editor.changed(holder)
}

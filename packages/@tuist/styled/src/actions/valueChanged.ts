import { Action } from '../app'

export const valueChanged: Action<{
  form: { [key: string]: any }
  name: string
  value: any
}> = (_, { form, name, value }) => {
  if (value === undefined) {
    delete form[name]
  } else {
    form[name] = value
  }
}

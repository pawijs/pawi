import { Action } from './'

const submit: Action = ({ state }) => {
  // No props passed to submit
  console.log('SUBMIT state.login =', state.login)
}

const cancel: Action = () => {
  // No props passed to submit
  console.log('CANCEL')
}

const showPayload: Action<any> = ({ value }) => {
  alert(`showPayload: ${JSON.stringify(value)}`)
}

const toggleOpen: Action = ({ state }) => {
  state.test.open = !state.test.open
}

const open: Action = ({ value }) => {
  console.log('chat.open', value)
}

export const chat = { open }
export const login = { submit, cancel }
export const test = {
  showPayload,
  toggleOpen,
}

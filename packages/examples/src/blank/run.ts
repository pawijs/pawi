import { branchLoader, simpleLoader } from 'tuist'

import { ContextTypes } from './context'

async function run() {
  const { loader } = simpleLoader()
  const loadBranch = branchLoader<ContextTypes>(loader)
  async function relink() {
    const { value } = await loadBranch('.')
    const el = document.querySelector('#screen')
    if (el) {
      el.innerHTML = `<h1>${value.number!()}</h1>`
    } else {
      console.log('[ RUN ]', value.number!())
    }
  }
  relink()
}

run()

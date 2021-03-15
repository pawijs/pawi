import { loadBranch } from 'pawi'
import { Context } from '../lib/types'

async function run() {
  async function relink() {
    // This could go in the 'main' block but we are showing it
    // here to expose how a branch can be called from outside.
    const { value } = await loadBranch<Context>('src/tests/add')
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

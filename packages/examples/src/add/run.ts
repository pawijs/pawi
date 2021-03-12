import { branchLoader, simpleLoader } from 'examples/src/add/node_modules/examples/src/add/node_modules/pawi'
import { ContextTypes } from 'src/lib/context'

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

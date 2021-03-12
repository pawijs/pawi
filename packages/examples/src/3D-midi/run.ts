import { projectLoader, simpleLoader } from 'examples/src/3D-midi/node_modules/examples/src/3D-midi/node_modules/pawi'
import * as three from 'examples/src/3D-midi/node_modules/examples/src/3D-midi/node_modules/three'
import { ContextTypes } from 'src/lib/context'

async function run() {
  const { loader } = simpleLoader()
  const load = projectLoader<ContextTypes>(loader)
  const update = await load('.', { THREE: three })
  update()
}

run()

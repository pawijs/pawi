import * as three from 'three'

import { projectLoader, simpleLoader } from 'tuist'

import { ContextTypes } from './lib/context'

async function run() {
  const { loader } = simpleLoader()
  const load = projectLoader<ContextTypes>(loader)
  const update = await load('.', { THREE: three })
  update()
}

run()

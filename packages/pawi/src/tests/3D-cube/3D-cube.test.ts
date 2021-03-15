import { visualDiff } from '@web/test-runner-visual-regression'
import { run } from 'pawi'
import * as three from 'three'
import { Context } from '../lib/types'

function prepareScreen() {
  const element = document.createElement('div')
  element.id = 'screen'
  element.style.width = '800px'
  element.style.height = '600px'
  document.body.appendChild(element)
  return element
}

// Regression test for a complete branch execution with collect, route, update, etc.
// This runs in development (HMR) mode because we include snowpack-pawi plugin
// in snowpack.config.cjs.
it('renders 3D-cube', async () => {
  const screen = prepareScreen()
  await run<Context>('/src/tests/3D-cube', {
    THREE: three,
    time: { dt: 0, now: 3.5 },
  })

  await visualDiff(screen, '3D-cube-1')
  screen.remove()
})

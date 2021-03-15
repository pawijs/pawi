import { visualDiff } from '@web/test-runner-visual-regression'
import { run } from 'pawi'
import * as three from 'three'
import { Context } from '../lib/types'

it('renders 3D-cube', async () => {
  const element = document.createElement('p')
  element.id = 'screen'
  element.style.width = '800px'
  element.style.height = '600px'
  document.body.appendChild(element)
  await run<Context>('/src/tests/3D-cube', {
    THREE: three,
    time: { dt: 0, now: 3.5 },
  })

  await visualDiff(element, '3D-cube')
})

//const { value } = await loadBranch<Context>('src/tests/add')

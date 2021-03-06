import { Setup } from '@pawi/build'
import { DragdropConfig, DragdropDefinitions, DragdropSettings } from './types'

interface TwoLevels {
  [key: string]: {
    [key: string]: any
  }
}

function mergeTwoLevels(target: TwoLevels, source: TwoLevels) {
  Object.keys(source).forEach(k => {
    target[k] = Object.assign(target[k] || {}, source[k])
  })
}

export const setup: Setup<DragdropConfig, DragdropSettings> = (
  config,
  settings
) => {
  const types: DragdropDefinitions['types'] = {}
  const dragTransform: DragdropDefinitions['dragTransform'] = {}
  const dropTransform: DragdropDefinitions['dropTransform'] = {}
  Object.keys(settings).forEach(blockName => {
    const setting = settings[blockName]
    if (setting.types) {
      Object.assign(types, setting.types)
    }
    if (setting.dragTransform) {
      mergeTwoLevels(dragTransform, setting.dragTransform)
    }
    if (setting.dropTransform) {
      mergeTwoLevels(dropTransform, setting.dropTransform)
    }
  })

  const definitions = { types, dragTransform, dropTransform }
  config.state.dragdrop.definitions = () => definitions
}

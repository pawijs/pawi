import {
  Families,
  FamilyComponents,
  IconComponentType,
  IconSettings,
  StyledConfig,
  StyledSettings,
  unSugarFamilySetting,
} from './types'

import { Setup } from '@tuist/build'
import { makeInspector } from './makeInspector'

export const setup: Setup<StyledConfig, StyledSettings> = (
  config,
  settings
) => {
  const icons: IconSettings = {}
  const familySettings: Families = {}
  let IconComponent: IconComponentType = config.state.styled.iconProvider()
    .IconComponent
  Object.keys(settings).forEach(modName => {
    const opts = settings[modName]
    if (opts.IconComponent) {
      IconComponent = opts.IconComponent
    }
    if (opts.icons) {
      Object.assign(icons, opts.icons)
    }
    const inspectors = opts.inspector

    const children = opts.family
    if (children) {
      Object.keys(children).forEach(familyName => {
        if (!familySettings[familyName]) {
          familySettings[familyName] = {}
        }
        Object.assign(familySettings[familyName], children[familyName])
      })
    }

    if (inspectors) {
      // Transform inspectors into family settings. As we have to do this in
      // reverse order to have inspectors respect addition order, we first save
      // the list.
      Object.keys(inspectors).forEach(inspectorName => {
        makeInspector(familySettings, inspectorName, inspectors[inspectorName])
      })
    }
  })

  const show = Object.keys(familySettings).reduce((acc, name) => {
    acc[name] = {}
    return acc
  }, {} as { [key: string]: {} })

  const familyItems: FamilyComponents = {}
  Object.keys(familySettings).forEach(familyName => {
    const children = familySettings[familyName]
    if (!familyItems[familyName]) {
      familyItems[familyName] = {}
    }
    Object.keys(children).forEach(childName => {
      const setting = unSugarFamilySetting(children[childName])
      familyItems[familyName][childName] = Object.assign(
        { group: 'main' },
        setting
      )
    })
  })
  Object.assign(config.state.styled, {
    iconProvider: () => ({ IconComponent, icons }),
    familyComponents: () => familyItems,
    show,
    showTips: true,
  })
}

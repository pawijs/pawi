import { Context } from './app'
import { InspectorGroup, InspectorIcon } from './components'
import { Families, Inspectors, unSugarFamilySetting } from './types'

export * from './components'
export * from './theme'
export * from './types'

export function makeInspector(
  families: Families,
  family: string,
  settings: Inspectors['']
) {
  const groupName = settings.inspector || 'inspector'
  if (!families[groupName]) {
    families[groupName] = {}
  }
  const group = families[groupName]
  group[family] = {
    component: settings.component || InspectorGroup,
    enable: settings.enable,
    visible: settings.visible,
    props: { family },
  }

  const toolbarName = `${family}Toolbar`
  if (!families[toolbarName]) {
    families[toolbarName] = {}
  }
  const toolbar = families[toolbarName]
  const stoolbar = settings.toolbar
  if (stoolbar) {
    Object.keys(stoolbar).forEach(child => {
      toolbar[child] = Object.assign(
        {},
        {
          props: { family, child, exclusive: settings.exclusive },
        },
        unSugarFamilySetting(stoolbar[child])
      )
    })
  }
  const content = (families[family] = {} as Families[''])
  const { children } = settings
  Object.keys(children).forEach(child => {
    const childSetting = unSugarFamilySetting(children[child])
    const component = childSetting.iconComponent || InspectorIcon
    if (!stoolbar) {
      toolbar[child] = {
        component,
        enable: childSetting.enable,
        visible: childSetting.visible,
        props: {
          family,
          child,
          exclusive: settings.exclusive,
        },
      }
    }
    content[child] = Object.assign(
      {
        visible(ctx: Context) {
          return ctx.state.styled.show[family][child]
        },
      },
      childSetting
    )
  })
}

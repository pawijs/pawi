import * as actions from './actions'
import { ResizeArg } from './components'
import { InspectorGroupProps, InspectorIconProps } from './components/Inspector'

export interface IconSettings {
  [iconName: string]: any
}

export interface IconComponentProps {
  fixedWidth?: boolean
  spin?: boolean
  icon: string
  icons: IconSettings
  className?: string
  onClick?: (e: any) => void
  style?: any
}

export type IconComponentType =
  | React.ComponentClass<IconComponentProps>
  | React.SFC<IconComponentProps>

export type ChildComponent<T> =
  | React.ComponentClass<T>
  | React.FunctionComponent<T>

type PropsFunc<T, App> = (
  ctx: App,
  arg: {
    family: string
    child: string
    props: any
  }
) => T

export interface FamilySetting<T = any, App = any> {
  component: ChildComponent<any>
  // Use this to group children in rows
  group?: string
  // extra props passed to component
  props?: T | PropsFunc<T, App>
  enable?: PropsFunc<boolean | undefined, App>
  visible?: PropsFunc<boolean | undefined, App>
}

interface ChildSetting<T = any, App = any> {
  component: ChildComponent<T>
  // Use this to group children
  group: string
  // extra props passed to component
  props?: T | PropsFunc<T, App>
  enable?: PropsFunc<boolean | undefined, App>
  visible?: PropsFunc<boolean | undefined, App>
}

export interface Family {
  [childName: string]: FamilySetting<any> | ChildComponent<any>
}

export interface Families {
  [familyName: string]: Family
}

export interface Inspectors {
  [family: string]: {
    // Default inspector is 'inspector'
    inspector?: string
    exclusive?: boolean
    enable?: PropsFunc<boolean, any>
    visible?: PropsFunc<boolean, any>
    toolbar?: Families['']
    component?: ChildComponent<InspectorGroupProps>
    children: {
      [child: string]:
        | (FamilySetting<any> & {
            iconComponent?: ChildComponent<InspectorIconProps>
          })
        | ChildComponent<any>
    }
  }
}

export interface FamilyComponents {
  [key: string]: {
    [childName: string]: ChildSetting<any>
  }
}

export interface StyledSettings {
  styled?: {
    IconComponent?: IconComponentType
    // The `icons` settings are passed as argument to the Icon
    // component.
    icons?: IconSettings
    family?: Families
    inspector?: Inspectors
  }
}

export interface StyledConfig {
  state: {
    styled: {
      iconProvider: () => {
        IconComponent: IconComponentType
        icons: IconSettings
      }
      familyComponents: () => FamilyComponents

      show: {
        [family: string]: {
          [child: string]: boolean
        }
      }

      sizes: {
        [key: string]: ResizeArg
      }

      showTips: boolean
    }
  }
  actions: {
    styled: typeof actions
  }
}

function isJustComponent(comp: Families['']['']): comp is ChildComponent<any> {
  return !(comp as any).component
}

export function unSugarFamilySetting(
  comp: Families['']['']
): FamilySetting & { iconComponent?: any } {
  if (isJustComponent(comp)) {
    return { component: comp }
  } else {
    return comp
  }
}

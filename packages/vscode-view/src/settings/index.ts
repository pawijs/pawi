import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { PreferencesHooks, PreferencesSettings } from '@forten/preferences'
import { StyledSettings } from '@forten/styled'
import { TreeSettings } from '@forten/tree'
import { EditorSettings } from '@pawi/editor'
import { Context } from '../app'
import { tree } from './tree'

type Settings = EditorSettings &
  TreeSettings &
  StyledSettings &
  PreferencesSettings & { hooks: PreferencesHooks }

export const settings: Settings = {
  tree,
  hooks: {
    preferences_restored(ctx: Context) {
      ctx.state.pawi.loading = false
    },
  },
  preferences: {
    paths: {
      ['pawi.showLibrary']: true,
      ['styled.sizes']: true,
    },
  },
  styled: {
    icons: {
      library: faBars,
    },
  },
}

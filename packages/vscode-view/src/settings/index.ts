import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { EditorSettings } from '@pawi/editor'
import { PreferencesHooks, PreferencesSettings } from '@pawi/preferences'
import { StyledSettings } from '@pawi/styled'
import { TreeSettings } from '@pawi/tree'
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

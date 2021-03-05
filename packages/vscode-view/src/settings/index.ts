import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { EditorSettings } from '@tuist/editor'
import { PreferencesHooks, PreferencesSettings } from '@tuist/preferences'
import { StyledSettings } from '@tuist/styled'
import { TreeSettings } from '@tuist/tree'
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
      ctx.state.tuist.loading = false
    },
  },
  preferences: {
    paths: {
      ['tuist.showLibrary']: true,
      ['styled.sizes']: true,
    },
  },
  styled: {
    icons: {
      library: faBars,
    },
  },
}

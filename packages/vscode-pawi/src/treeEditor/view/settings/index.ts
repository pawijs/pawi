import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { PreferencesHooks, PreferencesSettings } from '@forten/preferences'
import { StyledSettings } from '@forten/styled'
import { TreeSettings } from '@forten/tree'
import { Context } from '../app'
import { tree } from './tree'

type Settings = TreeSettings &
  StyledSettings &
  PreferencesSettings & { hooks: PreferencesHooks }

export const settings: Settings = {
  tree,
  hooks: {
    preferences_restored(ctx: Context) {
      ctx.state.treeEditor.loading = false
    },
  },
  preferences: {
    paths: {
      ['treeEditor.showLibrary']: true,
      ['styled.sizes']: true,
    },
  },
  styled: {
    icons: {
      library: faBars,
      copy: faCopy,
    },
  },
}

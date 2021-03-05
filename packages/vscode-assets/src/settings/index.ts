import { EditorSettings } from '@tuist/editor'
import { TreeSettings } from '@tuist/tree'
import { tree } from './tree'

type Settings = EditorSettings & TreeSettings

export const settings: Settings = {
  tree,
}

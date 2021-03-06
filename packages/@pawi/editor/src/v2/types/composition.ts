import { Elements } from './element'
import { Sizes } from './size'
import { Toolbox } from './toolbox'

export interface Composition {
  sz?: Sizes

  toolbox?: Toolbox
  // Data for custom components.
  data?: { [key: string]: any }
  g: Elements
  // Path to object containing selection encoded as 'key.subKey.subsubKey'
  spath?: string
  // selection min paragraph position
  smin?: number
  // selection max paragraph position
  smax?: number
  // Title of the composition (when there is one)
  title?: string
}

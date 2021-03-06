import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core'
import { faParagraph } from '@fortawesome/free-solid-svg-icons/faParagraph'
import { faVideo } from '@fortawesome/free-solid-svg-icons/faVideo'
import { faPenAlt } from '@fortawesome/free-solid-svg-icons/faPenAlt'
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo'
import { faRedo } from '@fortawesome/free-solid-svg-icons/faRedo'
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons/faAlignJustify'
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons/faAlignLeft'
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons/faAlignCenter'
import { faAlignRight } from '@fortawesome/free-solid-svg-icons/faAlignRight'
import { faColumns } from '@fortawesome/free-solid-svg-icons/faColumns'

export const icons: { [key: string]: IconDefinition } = {
  P: faParagraph,
  Video: faVideo,
  Column: faColumns,
  align_j: faAlignJustify,
  // default
  align_d: faAlignJustify,
  align_l: faAlignLeft,
  align_c: faAlignCenter,
  align_r: faAlignRight,
  OpenPopup: faPenAlt,
  PageBreak: faParagraph,
  Undo: faUndo,
  Redo: faRedo,
}

library.add(...Object.keys(icons).map(k => icons[k]))

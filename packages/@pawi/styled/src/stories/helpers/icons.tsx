import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faFolder } from '@fortawesome/free-solid-svg-icons/faFolder'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons/faFolderOpen'
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'
import { faSplotch } from '@fortawesome/free-solid-svg-icons/faSplotch'
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faTooth } from '@fortawesome/free-solid-svg-icons/faTooth'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'

export const icons: { [key: string]: IconDefinition } = {
  add: faPlus,
  email: faEnvelope,
  user: faUser,
  username: faUser,
  password: faLock,
  folder: faFolder,
  folderOn: faFolderOpen,
  loading: faSpinner,
  Validate: faTooth,
  PleaseLogin: faLock,
  ResetField: faTimes,
  RefreshField: faSync,
  InvalidUsernameOrPassword: faTrash,
  TooManyEmotions: faSplotch,
  // inspector
  document1: faTooth,
  document2: faFolder,
  navigation1: faLock,
  navigation2: faUser,
}

library.add(...Object.keys(icons).map(k => icons[k]))

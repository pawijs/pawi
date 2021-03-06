import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core'
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight'
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle'

export const icons: { [key: string]: IconDefinition } = {
  CheckboxOn: faCheckSquare,
  CheckboxOff: faSquare,
  Recursive: faAngleRight,
  RecursiveOpen: faAngleDown,
  RecursiveClose: faAngleRight,
  Tooltips: faQuestionCircle,
}

library.add(...Object.keys(icons).map(k => icons[k]))

import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'

export const icons: { [key: string]: IconDefinition } = {
  code: faSearch,
}

library.add(...Object.keys(icons).map(k => icons[k]))

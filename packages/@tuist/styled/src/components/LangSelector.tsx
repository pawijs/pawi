import * as React from 'react'
import { Comp, useOvermind } from '../app'
import { Select } from './Select'

export interface LangSelectorProps {
  className?: string
  showKey?: boolean
}

export const LangSelector: Comp<LangSelectorProps> = ({
  className,
  showKey,
}) => {
  const app = useOvermind()
  const locales = app.state.locale.locales
  const setLang = app.actions.locale.set
  const translate = app.state.locale.translate
  const langList = Object.keys(locales)
  if (langList.length < 2) {
    return null
  }
  const options = langList
    .map(lang => ({ key: lang, value: translate(lang) }))
    .sort((a, b) => (a.key < b.key ? -1 : 1))
  return (
    <Select
      onChange={
        // istanbul ignore next
        (lang: string) => setLang(lang)
      }
      form={app.state.locale}
      name="lang"
      tip="tipLangSelector"
      className={className}
      options={options}
      showKey={showKey}
    />
  )
}

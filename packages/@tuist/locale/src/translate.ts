import { derive } from './app'
import { Translate } from './types'

function replaceWords(text: string, words: { [key: string]: string }) {
  return Object.keys(words).reduce(
    (text, word) => text.replace(new RegExp(`{${word}}`, 'g'), words[word]),
    text
  )
}

// Derived state
export const translate: Translate = derive(parent => {
  const { lang, locales, common } = parent
  if (lang === undefined) {
    throw new Error(`No locale. Make sure locale.lang is set !`)
  }
  const dictionary = locales[lang]
  if (dictionary === undefined) {
    throw new Error(`Missing dictionary for lang '${lang}'.`)
  }

  if (process.env.NODE_ENV === 'production') {
    return function translate(k: string, replace?: { [key: string]: string }) {
      const t = dictionary.hasOwnProperty(k) ? dictionary[k] : common[k]
      if (t === undefined) {
        return k
      } else if (replace) {
        return replaceWords(t, replace)
      } else {
        return t
      }
    }
  } else {
    return function translate(k: string, replace?: { [key: string]: string }) {
      const t = dictionary.hasOwnProperty(k) ? dictionary[k] : common[k]
      if (t === undefined) {
        console.error(`Missing translation for '${k}' in '${lang}'.`)
        return `## ${lang}:${k} ##`
      } else if (replace) {
        return replaceWords(t, replace)
      } else {
        return t
      }
    }
  }
})

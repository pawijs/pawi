import * as React from 'react'

import {
  EditorProvider,
  InternalParagraphOption,
  ParagraphPayload,
  Paragraphs,
  isCustomParagraphOption,
  isSelectParagraphOption,
  isSimpleParagraphOption,
} from './lib/utils/types'

import { EditorOptions } from './lib'
import { OperationsKey } from './lib/doOperation'

function prepareParagraphs(
  paragraphs: Paragraphs
): { [key: string]: InternalParagraphOption } {
  const results: { [key: string]: InternalParagraphOption } = {}
  Object.keys(paragraphs).forEach(key => {
    const settings = paragraphs[key]
    if (isSelectParagraphOption(settings)) {
      results[key] = Object.assign({}, settings, {
        key,
        payload: JSON.stringify({}),
        showOn: {
          selection: true,
        },
      })
    } else if (isSimpleParagraphOption(settings)) {
      const payload: ParagraphPayload = {
        o: Object.assign({}, settings.o, { t: key }),
      }
      results[key] = Object.assign({}, settings, {
        key,
        op: 'P',
        payload: JSON.stringify(payload),
        showOn: {
          paragraph: true,
          emptyParagraph: true,
        },
      })
    } else if (isCustomParagraphOption(settings)) {
      const payload: ParagraphPayload = {
        c: key,
      }
      results[key] = Object.assign({}, settings, {
        key,
        c: key,
        op: 'P' as OperationsKey,
        payload: JSON.stringify(payload),
        showOn: {
          emptyParagraph: true,
        },
      })
    }
  })
  return results
}

export function parseOptions(editorOpts: EditorOptions): EditorProvider {
  const paragraphs = prepareParagraphs(editorOpts.paragraphs || {})
  const paragraphList = Object.keys(paragraphs).map(key => paragraphs[key])
  const startText: EditorProvider['startText'] = Object.assign(
    {},
    ...paragraphList
      .filter(para => para.startText)
      .map(para => ({ [para.startText!]: para }))
  )

  const preload = paragraphList
    .map(para => para.preload)
    .filter(tag => tag !== undefined) as (
    | React.StatelessComponent<{}>
    | React.ComponentClass<{}>
  )[]

  const markup = paragraphList.filter(c => c.markup)
  // FIXME: only use 'getMarkup' in pasteText hook.
  function getMarkup(text: string) {
    for (const para of markup) {
      const data = para.markup!(text)
      if (data) {
        return { c: para.c!, data }
      }
    }
    return undefined
  }

  function getMenuChoices(type: 'paragraph' | 'selection' | 'emptyParagraph') {
    return paragraphList.filter(c => c.showOn[type])
  }

  return {
    getMarkup,
    getMenuChoices,
    paragraphList,
    paragraphs,
    paste: editorOpts.paste || {},
    preload,
    startText,
  }
}

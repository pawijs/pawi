import { Action } from '../app'
import { Locales } from '../types'
const SEP = ','

// no need to check coverage for this: it is not used in production
// istanbul ignore next
export const print: Action = ctx => {
  const langs = Object.keys(ctx.state.locale.locales)
  const sources = ctx.state.locale.sources
  const values: string[] = [['module', 'key', ...langs].join(SEP)]
  Object.keys(sources)
    .sort()
    .forEach(blockName => {
      const def = sources[blockName]
      const en = def['en']
      Object.keys(en).forEach(key => {
        values.push(
          [
            blockName,
            key,
            ...langs.map(lang => JSON.stringify((def[lang] || {})[key] || '')),
          ].join(SEP)
        )
      })
    })
  console.log(values.join('\n'))
}

// no need to check coverage for this: it is not used in production
// istanbul ignore next
export const printMissing: Action<string> = (ctx, value) => {
  const origin = ctx.state.locale.lang === value ? 'en' : ctx.state.locale.lang
  let hasMissing = false
  const sources = ctx.state.locale.sources
  const missing: { [block: string]: Locales['lang'] } = {}
  Object.keys(sources).forEach(blockName => {
    const def = sources[blockName]
    const en = def[origin] || def['en']
    const enK = Object.keys(en)
    const targetK = Object.keys(def[value] || {})
    const missingK = enK.filter(k => !targetK.includes(k))
    if (missingK.length) {
      missingK.sort()
      missing[blockName] = Object.assign(
        {},
        ...missingK.map(k => ({ [k]: en[k] }))
      )
      hasMissing = true
    }
  })
  if (hasMissing) {
    console.warn(`Missing translations for lang '${value}'`)
    console.log(JSON.stringify(missing, null, 2))
  }
}

export const set: Action<string> = (ctx, value) => {
  // istanbul ignore next
  if (process.env.NODE_ENV !== 'production') {
    ctx.actions.locale.print()
    ctx.actions.locale.printMissing(value)
  }
  ctx.state.locale.lang = value
  // LOCALE_SET hook is triggered by observing path. Do not run here.
}

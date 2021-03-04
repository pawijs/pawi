import Bowser from 'bowser'
import { Overmind } from 'overmind'
import { Workbox } from 'workbox-window'
import { AsyncAction } from './app'
import { setupAppUpdate } from './helpers/appUpdate.setup'
import { setupWinPosition } from './helpers/winPosition.setup'
import { UseragentConfig, useragent_invalidBrowser } from './types'

export const onInitialize: AsyncAction<
  Overmind<UseragentConfig>,
  false | void
> = async ctx => {
  const { focusChanged, networkChanged } = ctx.actions.useragent
  const browser = Bowser.getParser(window.navigator.userAgent)
  const results = browser.getResult()
  ctx.state.useragent.browser = results
  const valid = browser.satisfies(ctx.state.useragent.browserRequirements)
  if (!valid) {
    await ctx.actions.hooks[useragent_invalidBrowser]({
      browser: results,
    })
    // Halt app.
    if (valid === undefined) {
      console.error(
        `Unknown browser '${results.browser.name}' (not in requirements).`
      )
    } else {
      console.error('Invalid browser')
    }
    console.log('Requirements:')
    console.log(
      JSON.stringify(ctx.state.useragent.browserRequirements, null, 2)
    )
    return false
  }

  setupAppUpdate(ctx)
  setupWinPosition(ctx)

  window.addEventListener('online', () => {
    networkChanged({ network: navigator.onLine })
  })
  window.addEventListener('offline', () => {
    networkChanged({ network: navigator.onLine })
  })
  networkChanged({ network: navigator.onLine })

  window.addEventListener('focus', () => {
    focusChanged({ focus: true })
  })
  window.addEventListener('blur', () => {
    focusChanged({ focus: false })
  })
  focusChanged({ focus: true })

  const { serviceWorker, updateCheckInterval } = ctx.state.useragent.options
  if (serviceWorker) {
    if ('serviceWorker' in navigator) {
      const wb = new Workbox(serviceWorker)

      wb.addEventListener('installed', event => {
        // This is triggered on page load if a new version is available right
        // after.
        if (event.isUpdate) {
          // Check for isUpdate to avoid initial load to trigger this.
          ctx.actions.useragent.hasWebUpdate()
        }
      })

      wb.addEventListener('externalinstalled', event => {
        // This can happen because we check for updates and the 'installed'
        // vs 'externalinstalled' heuristic in Workbox is weird (to say the least).
        ctx.actions.useragent.hasWebUpdate()
      })

      const reg = await wb.register()

      if (updateCheckInterval && reg) {
        setInterval(() => {
          if (ctx.state.useragent.hasNetwork) {
            if (process.env.APP_ENV === 'staging') {
              console.log('CHECK')
            }
            reg.update()
          }
        }, updateCheckInterval * 1000)
      }
    }
  } else {
    console.info('serviceWorker not set: skip.')
  }
  // Do not return 'false' => app can continue
  return
}

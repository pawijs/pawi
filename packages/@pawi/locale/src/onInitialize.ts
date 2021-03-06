import { Overmind } from 'overmind'
import { Action } from './app'
import { locale_set } from './types'

export const onInitialize: Action<Overmind<{}>> = (ctx, app) => {
  app.addMutationListener(({ path, args }) => {
    if (path.startsWith('locale.lang')) {
      // no await
      ctx.actions.hooks[locale_set]({ lang: args[0] })
    }
  })
}

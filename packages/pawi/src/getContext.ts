import { newCache } from './cache'
import { CacheFunction, TContext } from './types'

export function getContext<T extends Object = {}>(
  cacheFn: CacheFunction,
  name: string,
  parentContext: Partial<T>
): { context: TContext<T>; sweep: () => void } {
  const { cache, sweep } = cacheFn(
    name,
    () => newCache(),
    // In case this whole block is not seen on branch reload, clear
    // cache.
    ({ clear }) => clear()
  )
  const context = {
    ...parentContext,
    cache,
  } as TContext<T>
  return { context, sweep }
}

import { makeHook } from '@pawi/hooks'
import { Parser } from 'bowser'
import {
  useragent_blur,
  useragent_focus,
  useragent_invalidBrowser,
  useragent_network,
  useragent_online,
  useragent_restart,
} from './types'

export const hooksActions = {
  [useragent_network]: makeHook<{ network: boolean }>(useragent_network),
  [useragent_online]: makeHook<{ online: boolean }>(useragent_online),
  [useragent_focus]: makeHook<{ focus: boolean }>(useragent_focus),
  [useragent_blur]: makeHook<{ blur: boolean }>(useragent_blur),
  [useragent_restart]: makeHook(useragent_restart),
  [useragent_invalidBrowser]: makeHook<{ browser: Parser.ParsedResult }>(
    useragent_invalidBrowser
  ),
}

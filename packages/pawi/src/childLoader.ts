import { Branch } from '@forten/tree-type'
import { getContext } from './getContext'
import { initBranch } from './initBranch'
import { ChildLoader, Loader, TChild } from './link.types'
import {
  CacheFunction,
  ReloadFn,
  TArg,
  TBlockModule,
  TContext,
  Update,
} from './types'

type Context = TContext<{}>
type BlockModule = TBlockModule<{}>
interface InitModuleArg {
  id: string
  path: string
  parentContext: {}
  devMode?: boolean
  run: boolean
}

interface ArgWrapper<V> {
  value: V
  current: V
}

type AnyArg = TArg<{ [key: string]: any }>

function HmrWrap<T extends AnyArg>(
  cache: Context['cache'],
  currentValue: T
): T {
  const wrapper = cache(':hmrWrapper:', () => {
    const value: AnyArg = {}
    const current: AnyArg = {}
    const wrapper: ArgWrapper<AnyArg> = {
      value,
      current,
    }
    Object.keys(currentValue).forEach(k => {
      if (typeof currentValue[k] === 'function') {
        value[k] = () => current[k]!()
      }
    })
    return wrapper
  })
  Object.assign(wrapper.current, currentValue)
  return wrapper.value as T
}

function getArguments<T>(call: Function, children: TChild<T>[]) {
  return {
    args: Array.from({ length: call.length }).map(
      (_, i) => (children[i] && children[i].value) || {}
    ),
    // all updates
    updates: ([] as Update[]).concat(...children.map(child => child.updates)),
  }
}

function getRoutes<T>(route: Function, children: TChild<T>[]) {
  return {
    args: Array.from({ length: route.length }).map(
      (_, i) => (children[i] && updateAll(children[i].updates)) || {}
    ) as Update[],
    // out-of-route updates
    updates: ([] as Update[]).concat(
      ...children.slice(route.length).map(child => child.updates)
    ),
  }
}

export function updateAll(updates: Update[]) {
  return () => {
    for (const update of updates) {
      update()
    }
  }
}

export function childLoader<T extends {} = {}>(
  cache: CacheFunction,
  loader: Loader,
  branch: Branch
): ChildLoader<T> {
  const blocks = branch.blocks
  const { load } = loader

  async function getChildren(
    id: string,
    parentContext: {}
  ): Promise<TChild<T>[]> {
    const block = blocks[id]
    const children: TChild<T>[] = []
    if (block.children) {
      for (const id of block.children) {
        children.push(await loadChild(id, parentContext))
      }
    }
    return children
  }

  async function initModule(
    { id, path, parentContext, devMode }: InitModuleArg,
    mod: BlockModule
  ) {
    const { branch, init } = mod
    const { context, sweep } = getContext(cache, id, parentContext)
    if (branch) {
      const dirname = path.split('/').slice(0, -1).join('/')
      const child = await initBranch(
        loader.at(dirname),
        JSON.parse(branch),
        context
      )
      if (devMode) {
        child.value = HmrWrap(context.cache, child.value)
      }
      // Cleanup unused nodes
      sweep()
      return child
    }
    // Down context registration
    const block = init ? await init(context) : { ...mod }
    // Cleanup all unused values in context.cache after init
    sweep()
    if (block.error) {
      console.log(`[ ERROR ] ${block.error} (${path}).`)
      return { value: {}, updates: [] }
    }
    const { link, route, collect } = block
    // Cleanup parent context
    delete block.link
    delete block.route
    delete block.collect
    // Up function call registration
    // In dev mode (HMR), down calls are always re-run to update context.
    const children = await getChildren(id, {
      ...parentContext,
      ...block,
    })
    if (link) {
      const { args, updates } = getArguments(link, children)
      const rawValue = link(...args) || {}
      const value = devMode ? HmrWrap(context.cache, rawValue) : rawValue
      if (value.update) {
        return { value: {}, updates: [...updates, value.update] }
      } else {
        return { value, updates }
      }
    } else if (route) {
      const { args, updates } = getRoutes(route, children)
      const rawValue = { update: () => route(...args) }
      const { update } = devMode ? HmrWrap(context.cache, rawValue) : rawValue
      return { value: {}, updates: [...updates, update] }
    } else {
      const updates = ([] as Update[]).concat(
        ...children.map(child => child.updates)
      )
      if (collect) {
        const rawValue = { update: collect(updateAll(updates)) }
        const { update } = devMode ? HmrWrap(context.cache, rawValue) : rawValue
        return { value: {}, updates: [update] }
      } else {
        // pass updates up
        return { value: {}, updates }
      }
    }
  }

  async function initAndRun(arg: InitModuleArg, mod: BlockModule) {
    const child = await initModule(arg, mod)
    if (arg.run) {
      updateAll(child.updates)()
    }
    return child
  }

  async function loadChild(
    id: string | null,
    parentContext: Partial<T>,
    run = false
  ): Promise<TChild<T>> {
    if (!id) {
      return { value: {}, updates: [] }
    }
    const path = blocks[id].content.file
    const mod: BlockModule = await load(path)
    const arg = { id, path, parentContext, devMode: false, run }
    if (mod.pawi) {
      // pawi object set by hmr extension
      arg.devMode = true
      if (!mod.pawi.blocks) {
        const blocksFn: ReloadFn[] = [({ module }) => initAndRun(arg, module)]
        mod.pawi.blocks = blocksFn
        mod.pawi.reload = async arg => {
          console.log('[PAWI-HMR]', path)
          for (const fn of blocksFn) {
            await fn(arg)
          }
        }
      } else {
        mod.pawi.blocks.push(({ module }) => initAndRun(arg, module))
      }
    }
    return initAndRun(arg, mod)
  }

  return loadChild
}

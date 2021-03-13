import { Branch } from '@forten/tree-type'
import { TArg, TBlockModule, TContext, Update } from 'pawi'
import { ChildLoader, Loader, TChild } from './types'

type Context = TContext<{}>
type BlockModule = TBlockModule<{}>

function makeCacheFunction(): Context['cache'] {
  const store = new Map<string, any>()
  return function cache(name, fn) {
    if (!store.has(name)) {
      store.set(name, fn())
    }
    return store.get(name)
  }
}

interface ArgWrapper<V> {
  value: V
  current: V
}

type AnyArg = TArg<{ [key: string]: any }>

function makeHmrWrapper<T extends AnyArg>(
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
    ),
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
  load: Loader,
  branch: Branch
): ChildLoader<T> {
  const caches = new Map<string, {}>()
  const blocks = branch.blocks

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

  function getContext(name: string, parentContext: {}): Context {
    if (!caches.has(name)) {
      caches.set(name, makeCacheFunction())
    }
    return {
      ...parentContext,
      cache: caches.get(name) as Context['cache'],
      detached: false,
    }
  }

  async function initModule(
    {
      id,
      path,
      parentContext,
      devMode,
    }: {
      id: string
      path: string
      parentContext: {}
      devMode?: boolean
    },
    mod: BlockModule
  ) {
    const { init } = mod
    const context = getContext(id, parentContext)
    // Down context registration
    const block = init ? await init(context) : { ...mod }
    if (block.error) {
      console.log(`[ ERROR ] ${block.error} (${path}).`)
      return { value: {}, updates: [] }
    }
    const { link, route, collect } = block
    // Cleanup parent context
    delete block.link
    delete block.collect
    delete block.link
    // Up function call registration
    // In dev mode (HMR), down calls are always re-run to update context.
    const children = await getChildren(id, {
      ...parentContext,
      ...block,
    })
    if (link) {
      const { args, updates } = getArguments(link, children)
      const rawValue = link(...args) || {}
      const value = devMode ? makeHmrWrapper(context.cache, rawValue) : rawValue
      if (value.update) {
        return { value: {}, updates: [...updates, value.update] }
      } else {
        return { value, updates }
      }
    } else if (route) {
      const { args, updates } = getRoutes(route, children)
      return { value: {}, updates: [...updates, () => route(...args)] }
    } else {
      const updates = ([] as Update[]).concat(
        ...children.map(child => child.updates)
      )
      if (collect) {
        const update = collect(updateAll(updates))
        return { value: {}, updates: [update] }
      } else {
        // pass updates up
        return { value: {}, updates }
      }
    }
  }

  async function loadChild(
    id: string | null,
    parentContext: Partial<T> = {}
  ): Promise<TChild<T>> {
    if (!id) {
      return { value: {}, updates: [] }
    }
    const path = blocks[id].content.file
    const mod: BlockModule = await load(path)
    const arg = { id, path, parentContext, devMode: false }
    if (mod.pawi) {
      // pawi object set by hmr extension
      arg.devMode = true
      mod.pawi.reload = ({ module }) => {
        console.log('[PAWI-HMR]', path)
        initModule(arg, module)
      }
    }
    return initModule(arg, mod)
  }

  return loadChild
}
import { Context, NodeModule, TChild, Update } from '..'
import { Branch } from '../branch/types'
import { Load } from '../loader/types'
import { ChildLoader } from './types'

function makeCacheFunction(): Context['cache'] {
  const store = new Map<string, any>()
  return function cache(name, fn) {
    if (!store.has(name)) {
      store.set(name, fn())
    }
    return store.get(name)
  }
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
  load: Load,
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

  async function loadChild(
    id: string | null,
    parentContext: Partial<T> = {}
  ): Promise<TChild<T>> {
    if (!id) {
      return { value: {}, updates: [] }
    }
    const path = blocks[id].content.file
    const mod: NodeModule = await load(path)
    const { init } = mod

    // Down context registration
    const node = init ? init(getContext(id, parentContext)) : { ...mod }
    if (!node) {
      console.log(`Node '${path}' is broken.`)
      return { value: {}, updates: [] }
    }
    const { link, route, collect } = node
    // Cleanup parent context
    delete node.link
    delete node.collect
    delete node.link
    // Up function call registration
    const children = await getChildren(id, {
      ...parentContext,
      ...node,
    })
    if (link) {
      const { args, updates } = getArguments(link, children)
      const value = link(...args) || {}
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

  return loadChild
}

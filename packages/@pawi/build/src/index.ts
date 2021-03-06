import { IConfiguration, mutate, Overmind } from 'overmind'
import { Options } from 'overmind/lib/internalTypes'
import { addDependencies } from './addDependencies'
import { Block, Initializer, Setup, UnknownObject, Using } from './types'

export * from './reference'
export { Block, Setup } from './types'
export * from './unproxy'

function mergeFunctions<T>(
  target: { [key: string]: any },
  source: { [key: string]: any },
  path: string[]
) {
  Object.keys(source).forEach(key => {
    const value = source[key]
    if (isObj(value)) {
      // needs to go deeper
      if (target[key] === undefined || isObj(target[key])) {
        // go deeper
        if (!target[key]) {
          target[key] = {}
        }
        mergeFunctions(target[key], value, [...path, key])
      } else {
        throw new Error(`Cannot redefine '${[...path, key].join('.')}'.`)
      }
    } else if (typeof value === 'function') {
      if (target[key]) {
        throw new Error(`Cannot redefine '${[...path, key].join('.')}'.`)
      } else {
        target[key] = value
      }
    } else {
      throw new Error(
        `Value at '${[...path, key].join('.')}' is not a function.`
      )
    }
  })
}

interface Result extends IConfiguration {
  actions: any
  effects: any
  reactions: any
  state: any
}

function parseBlocks(theBlocks: Block[]) {
  const blocks = addDependencies(theBlocks)
  const setupFuncs: { [blockName: string]: Setup } = {}
  const initializers: Initializer[] = []
  const result: Result = {
    actions: {},
    effects: {},
    reactions: {},
    state: {},
  }
  const rsettings: any = {}

  // (1) Merge state and collect settings from bottom to top ('using' before 'build', 'dependencies' before 'block')
  blocks.forEach(block => {
    const name = block.name
    if (!name) {
      console.log(block)
      throw new Error(`Invalid block (missing name).`)
    }

    // Setup function.
    if (block.setup) {
      setupFuncs[name] = block.setup
    }

    // App boot
    if (block.onInitialize) {
      initializers.push(block.onInitialize)
    }

    // Merge state.
    if (block.state) {
      result.state = deepMerge(block.name, result.state, block.state, ['state'])
    }

    mergeFunctions(result.actions, block.actions || {}, ['actions'])
    mergeFunctions(result.effects, block.effects || {}, ['effects'])

    // Collect settings.
    if (block.settings) {
      const blockSettings = block.settings as any
      Object.keys(blockSettings).forEach(blockName => {
        rsettings[blockName] = rsettings[blockName] || {}
        rsettings[blockName][name] = blockSettings[blockName]
      })
    }
  })

  result.onInitialize = mutate(async function (ctx, app) {
    for (const init of initializers) {
      const r = await init(ctx, app)
      if (r === false) {
        // Abort
        return
      }
    }
  })

  // (2) Run init functions (from bottom to top)
  Object.keys(setupFuncs).forEach(blockName => {
    const fn = setupFuncs[blockName]
    fn(result, rsettings[blockName] || {})
  })
  return result
}

export function build<T extends Block>(a: T): Using<T> {
  const blocks: Block[] = []
  let builder: any
  function using<U extends Block>(block: U) {
    blocks.unshift(block)
    return builder
  }

  builder = {
    state: new Error(`Please run 'config()' or 'app()' to finish build.`),
    using,
    config: () => parseBlocks(blocks),
    app: (options?: Options) => new Overmind(parseBlocks(blocks), options),
  }

  return builder.using(a)
}

function isObj(x: unknown): x is UnknownObject {
  return x !== null && typeof x === 'object' && !Array.isArray(x)
}

// We do not want the app state to contain any original objects
// because it can create bad bugs during testing or other
// leakage. Since initial app state is sparse, this does not
// have any impact on boot time.
function copyArrays(obj: any): any {
  if (Array.isArray(obj)) {
    return [...obj]
  } else if (isObj(obj)) {
    return Object.assign(
      {},
      ...Object.keys(obj).map(key => ({ [key]: copyArrays(obj[key]) }))
    )
  } else {
    return obj
  }
}

function deepMerge<T extends UnknownObject, U extends UnknownObject>(
  bName: string,
  base: T,
  changes: U,
  path: string[]
): U & T {
  const result: UnknownObject = Object.assign({}, base)
  Object.keys(changes).forEach(key => {
    const value = changes[key]
    const rvalue = result[key]
    if (isObj(rvalue)) {
      if (isObj(value)) {
        result[key] = deepMerge(bName, rvalue, value, [...path, key])
      } else {
        throw new Error(
          `Cannot merge: incompatible types at path '${[...path, key].join(
            '.'
          )}' (block '${bName}' has '${typeof value}' instead of '${typeof rvalue}').`
        )
      }
    } else if (rvalue === undefined || typeof rvalue === typeof value) {
      result[key] = copyArrays(value)
    } else {
      throw new Error(
        `Cannot merge: incompatible types at path '${[...path, key].join(
          '.'
        )}' (block '${bName}' has '${typeof value}' instead of '${typeof rvalue}').`
      )
    }
  })
  return result as T & U
}

/** Typing function used to ensure the settings for a block correspond to the
 * given type.
 */
export function settings<T>(arg: T): T {
  return arg
}

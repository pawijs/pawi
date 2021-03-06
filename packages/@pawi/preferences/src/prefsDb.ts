if (!window.indexedDB) {
  require('fake-indexeddb/auto')
}
import { unproxy } from '@pawi/build'
import Dexie from 'dexie'

// FIXME: Remove after 2020-04-30
localStorage.removeItem('pawi/preferences')

export function dbname(name: string = 'default') {
  return `prefs-${name.slice(0, 10)}${
    // istanbul ignore next
    process.env.NODE_ENV !== 'production' ? `-${process.env.NODE_ENV}` : ''
  }`
}

export class DexieDb extends Dexie {
  values: Dexie.Table<{ value: any; path: string }, string>

  constructor(name: string) {
    super(name)
    this.version(1).stores({
      values: 'path',
    })
    this.values = this.table('values')
  }
}

let db: DexieDb = new DexieDb(dbname())

export async function selectPrefsDb(
  userId: string | undefined,
  defaults: { [path: string]: any }
) {
  const name = dbname(userId)
  const isNew = !(await Dexie.exists(name))
  db.close()
  db = new DexieDb(name)
  if (isNew) {
    // Insert defaults
    for (const path in defaults) {
      const value = defaults[path]
      await setValue(path, value)
    }
  }
  return db
}

// For testing
export async function resetDb() {
  await selectPrefsDb(undefined, {})
  await db.values.clear()
}

export async function deletePrefsDb(userId?: string) {
  const name = dbname(userId)
  if (await Dexie.exists(name)) {
    if (db.name === name) {
      db.close()
      await db.delete()
    } else {
      const db = new DexieDb(name)
      await db.delete()
    }
  }
}

export async function setValue(path: string, value: any) {
  if (typeof value === 'function') {
    return
  }
  await db.values.put({
    path,
    value: typeof value === 'object' ? unproxy(value) : value,
  })
}

export async function getValues() {
  const values: { path: string; value: any }[] = []
  await db.values.each(rec => {
    values.push(rec)
  })
  return values
}

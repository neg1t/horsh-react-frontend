import { type IDBPDatabase, openDB } from 'idb'

import type { HorschDBSchema } from './types'

const DB_NAME = 'horsch-db'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<HorschDBSchema>> | null = null

export function getDb(): Promise<IDBPDatabase<HorschDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<HorschDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('orders')) {
          db.createObjectStore('orders', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('pendingOperations')) {
          const store = db.createObjectStore('pendingOperations', {
            keyPath: 'id',
            autoIncrement: true,
          })
          store.createIndex('by-type', 'type')
        }
      },
    })
  }

  return dbPromise
}

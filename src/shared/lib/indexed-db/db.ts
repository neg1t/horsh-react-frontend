import { type IDBPDatabase, openDB } from 'idb'

import type { HorshDBSchema } from './types'

const DB_NAME = 'horsh-db'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<HorshDBSchema>> | null = null

export function getDb(): Promise<IDBPDatabase<HorshDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<HorshDBSchema>(DB_NAME, DB_VERSION, {
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

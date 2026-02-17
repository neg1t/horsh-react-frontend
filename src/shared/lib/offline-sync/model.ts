import { createEffect, createStore, sample } from 'effector'

import { type PendingOperation, getDb } from 'shared/lib/indexed-db'
import { networkModel } from 'shared/lib/network'

import { getSyncHandler } from './registry'

const loadPendingOperationsFx = createEffect(async () => {
  const db = await getDb()
  return db.getAll('pendingOperations')
})

const addPendingOperationFx = createEffect(
  async (op: Omit<PendingOperation, 'id'>) => {
    const db = await getDb()
    const id = await db.add('pendingOperations', op as PendingOperation)
    return { ...op, id } as PendingOperation
  },
)

const syncAllPendingFx = createEffect(
  async (operations: PendingOperation[]) => {
    const syncedIds: number[] = []

    for (const op of operations) {
      const handler = getSyncHandler(op.type)

      if (handler) {
        try {
          await handler(op.payload)
          const db = await getDb()
          await db.delete('pendingOperations', op.id!)
          syncedIds.push(op.id!)
        } catch (error) {
          console.error(
            `Failed to sync operation ${op.id} (${op.type}):`,
            error,
          )
        }
      }
    }

    return syncedIds
  },
)

const $pendingOperations = createStore<PendingOperation[]>([])
  .on(loadPendingOperationsFx.doneData, (_, ops) => ops)
  .on(addPendingOperationFx.doneData, (state, op) => [...state, op])
  .on(syncAllPendingFx.doneData, (state, syncedIds) =>
    state.filter((op) => !syncedIds.includes(op.id!)),
  )

const $hasPendingOperations = $pendingOperations.map((ops) => ops.length > 0)
const $pendingCount = $pendingOperations.map((ops) => ops.length)
const $isSyncing = syncAllPendingFx.pending

// Load pending operations on app start
loadPendingOperationsFx()

// Reload pending operations list when coming back online
sample({
  clock: networkModel.events.online,
  target: loadPendingOperationsFx,
})

export const offlineSyncModel = {
  stores: {
    $pendingOperations,
    $hasPendingOperations,
    $pendingCount,
    $isSyncing,
  },
  effects: {
    addPendingOperationFx,
    syncAllPendingFx,
    loadPendingOperationsFx,
  },
}

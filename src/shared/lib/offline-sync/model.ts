import { createEffect, createStore, sample } from 'effector'

import { type PendingOperation, getDb } from 'shared/lib/indexed-db'
import { networkModel } from 'shared/lib/network'

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

const $pendingOperations = createStore<PendingOperation[]>([])
  .on(loadPendingOperationsFx.doneData, (_, ops) => ops)
  .on(addPendingOperationFx.doneData, (state, op) => [...state, op])

const $hasPendingOperations = $pendingOperations.map((ops) => ops.length > 0)

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
  },
  effects: {
    addPendingOperationFx,
    loadPendingOperationsFx,
  },
}

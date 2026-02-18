import { createEffect, createStore, sample } from 'effector'
import { createGate } from 'effector-react'

import api from 'shared/api/client'
import { type PendingOperation, getDb } from 'shared/lib/indexed-db'
import { offlineSyncModel } from 'shared/lib/offline-sync'

import type { OrderDto } from './types'

const OrderListGate = createGate()

const fetchOrderListFx = createEffect(async () => {
  const resp = await api.get<OrderDto[]>('/order')
  return resp.data
})

const fetchPendingOperationsFx = createEffect(async () => {
  const db = await getDb()
  return db.getAll('pendingOperations')
})

const cacheOrdersFx = createEffect(async (orders: OrderDto[]) => {
  const db = await getDb()
  const tx = db.transaction('orders', 'readwrite')
  await tx.store.clear()
  for (const order of orders) {
    await tx.store.put(order)
  }
  await tx.done
})

const uploadOperationToServerFx = createEffect(async (op: PendingOperation) => {
  if (op.type === 'create-order') {
    await api.post('/order', op.payload)
    const db = await getDb()
    const tx = db.transaction('pendingOperations', 'readwrite')
    await tx.store.delete(op.id!)
    await tx.done
    return op.id
  }
})

const loadCachedOrdersFx = createEffect(async () => {
  const db = await getDb()
  return db.getAll('orders')
})

const $orders = createStore<OrderDto[]>([])
  .on(fetchOrderListFx.doneData, (_, orders) => orders)
  .on(loadCachedOrdersFx.doneData, (_, cached) => cached)

const $pendingOperations = createStore<PendingOperation[]>([]).on(
  fetchPendingOperationsFx.doneData,
  (_, ops) => ops,
)

const uploadOperationPending = uploadOperationToServerFx.pending

// When gate opens, fetch from API
sample({
  clock: [OrderListGate.open, uploadOperationToServerFx.doneData],
  target: [fetchOrderListFx, fetchPendingOperationsFx],
})

sample({
  clock: uploadOperationToServerFx.doneData,
  target: offlineSyncModel.effects.loadPendingOperationsFx,
})

// On successful fetch, cache orders to IndexedDB
sample({
  clock: fetchOrderListFx.doneData,
  target: cacheOrdersFx,
})

// On fetch failure (e.g. offline), load from IndexedDB cache
sample({
  clock: fetchOrderListFx.failData,
  target: loadCachedOrdersFx,
})

const effects = {
  uploadOperationToServerFx,
}

const stores = {
  $orders,
  $pendingOperations,
}

const gates = {
  OrderListGate,
}

const loadings = {
  uploadOperationPending,
}

export const orderListModel = {
  stores,
  gates,
  loadings,
  effects,
}

import { createEffect, createStore, sample } from 'effector'
import { createGate } from 'effector-react'

import api from 'shared/api/client'
import { getDb } from 'shared/lib/indexed-db'

import type { OrderDto } from './types'

const OrderListGate = createGate()

const fetchOrderListFx = createEffect(async () => {
  const resp = await api.get<OrderDto[]>('/order')
  return resp.data
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

const loadCachedOrdersFx = createEffect(async () => {
  const db = await getDb()
  return db.getAll('orders')
})

const $orders = createStore<OrderDto[]>([])
  .on(fetchOrderListFx.doneData, (_, orders) => orders)
  .on(loadCachedOrdersFx.doneData, (_, cached) => cached)

// When gate opens, fetch from API
sample({
  clock: OrderListGate.open,
  target: fetchOrderListFx,
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

const stores = {
  $orders,
}

const gates = {
  OrderListGate,
}

export const orderListModel = {
  stores,
  gates,
}

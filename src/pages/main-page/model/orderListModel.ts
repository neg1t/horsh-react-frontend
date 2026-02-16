import { createEffect, createStore, sample } from 'effector'
import { createGate } from 'effector-react'

import api from 'shared/api/client'

import type { OrderDto } from './types'

const OrderListGate = createGate()

const fetchOrderListFx = createEffect(async () => {
  const resp = await api.get<OrderDto[]>('/order')
  return resp.data
})

const $orders = createStore<OrderDto[]>([]).on(
  fetchOrderListFx.doneData,
  (_, orders) => orders,
)

sample({
  clock: OrderListGate.open,
  target: fetchOrderListFx,
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

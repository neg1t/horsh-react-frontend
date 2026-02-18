import type { DBSchema } from 'idb'

import type { OrderDto } from 'pages/main-page/model/types'
import type { CreateOrderDto } from 'pages/order-create/model/types'

type PendingOperationType = 'create-order'

export interface PendingOperation {
  id?: number
  type: PendingOperationType
  payload: CreateOrderDto
  createdAt: number
}

export interface HorschDBSchema extends DBSchema {
  orders: {
    key: number
    value: OrderDto
  }
  pendingOperations: {
    key: number
    value: PendingOperation
    indexes: { 'by-type': PendingOperationType }
  }
}

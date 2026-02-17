import type { DBSchema } from 'idb'

export interface PendingOperation {
  id?: number
  type: string
  payload: unknown
  createdAt: number
}

export interface HorshDBSchema extends DBSchema {
  orders: {
    key: number
    value: {
      id: number
      name: string
      description?: string
    }
  }
  pendingOperations: {
    key: number
    value: PendingOperation
    indexes: { 'by-type': string }
  }
}

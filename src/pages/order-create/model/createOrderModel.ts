import { createEffect, createEvent, createStore, sample } from 'effector'

import api from 'shared/api/client'
import { AppRoutes } from 'shared/config/routes'
import { networkModel } from 'shared/lib/network'
import { offlineSyncModel, registerSyncHandler } from 'shared/lib/offline-sync'
import { navigateToFx } from 'shared/lib/router-effects'

import type { CreateOrderDto } from './types'

// Register sync handler so the offline-sync layer knows how to send create-order ops
registerSyncHandler('create-order', async (payload) => {
  await api.post('/order', payload as CreateOrderDto)
})

const createOrderFx = createEffect(async (orderData: CreateOrderDto) => {
  return await api.post('/order', orderData)
})

const submitForm = createEvent()

const updateFormField = createEvent<{
  field: keyof CreateOrderDto
  value: string
}>()

const $form = createStore<CreateOrderDto>({
  id: '',
  name: '',
  description: '',
}).on(updateFormField, (state, { field, value }) => ({
  ...state,
  [field]: value,
}))

// Online: send to API directly
sample({
  clock: submitForm,
  source: { form: $form, isOnline: networkModel.stores.$isOnline },
  filter: ({ isOnline }) => isOnline,
  fn: ({ form }) => form,
  target: createOrderFx,
})

// Offline: save to pending operations queue in IndexedDB
sample({
  clock: submitForm,
  source: { form: $form, isOnline: networkModel.stores.$isOnline },
  filter: ({ isOnline }) => !isOnline,
  fn: ({ form }) => ({
    type: 'create-order',
    payload: form,
    createdAt: Date.now(),
  }),
  target: offlineSyncModel.effects.addPendingOperationFx,
})

// Navigate home after successful online creation
sample({
  clock: createOrderFx.doneData,
  target: navigateToFx.prepend(() => AppRoutes.MainPage.getDynamicPaths()),
})

// Navigate home after saving offline
sample({
  clock: offlineSyncModel.effects.addPendingOperationFx.doneData,
  filter: (op) => op.type === 'create-order',
  target: navigateToFx.prepend(() => AppRoutes.MainPage.getDynamicPaths()),
})

const events = {
  submitForm,
  updateFormField,
}

const effects = {
  createOrderFx,
}

const stores = {
  $form,
}

export const createOrderModel = {
  events,
  stores,
  effects,
}

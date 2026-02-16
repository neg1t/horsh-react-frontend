import { createEffect, createEvent, createStore, sample } from 'effector'

import api from 'shared/api/client'
import { AppRoutes } from 'shared/config/routes'
import { navigateToFx } from 'shared/lib/router-effects'

import type { CreateOrderDto } from './types'

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

sample({
  clock: submitForm,
  source: $form,
  target: createOrderFx,
})

sample({
  clock: createOrderFx.doneData,
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

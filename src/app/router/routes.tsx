import { lazy } from 'react'

import { createStore } from 'effector'

import { AppRoutes } from 'shared/config/routes'

import type { IRoute } from './types'

const MainPage = lazy(() =>
  import('pages/main-page').then((module) => ({ default: module.MainPage })),
)

const CreateOrder = lazy(() =>
  import('pages/order-create').then((module) => ({
    default: module.CreateOrder,
  })),
)

export const $routes = createStore<IRoute[]>([
  {
    path: AppRoutes.MainPage.path,
    Component: <MainPage />,
  },
  {
    path: AppRoutes.CreateOrder.path,
    Component: <CreateOrder />,
  },
])

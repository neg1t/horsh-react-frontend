type AppRoute = {
  path: string
  getDynamicPaths: (...args: string[]) => string
}

type RouteName = 'MainPage' | 'CreateOrder'

export const AppRoutes: Record<RouteName, AppRoute> = {
  MainPage: {
    path: '/',
    getDynamicPaths() {
      return this.path
    },
  },
  CreateOrder: {
    path: '/create-order',
    getDynamicPaths() {
      return this.path
    },
  },
} as const

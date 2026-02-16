type AppRoute = {
  path: string
  getDynamicPaths: (...args: string[]) => string
}

type RouteName = 'MainPage'

export const AppRoutes: Record<RouteName, AppRoute> = {
  MainPage: {
    path: '/',
    getDynamicPaths() {
      return this.path
    },
  },
} as const

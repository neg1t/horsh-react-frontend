import { Suspense } from 'react'

import { MainLayout } from 'app/layout/MainLayout'
import { useUnit } from 'effector-react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { PageLoader } from 'shared/components/PageLoader'

import { $routes } from './routes'

export const Router = () => {
  const routes = useUnit($routes)

  return (
    <MainLayout>
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={<Suspense fallback={<PageLoader />}>{Component}</Suspense>}
          />
        ))}

        {!!routes.length && (
          <Route path='*' element={<Navigate to={routes[0].path} replace />} />
        )}
      </Routes>
    </MainLayout>
  )
}

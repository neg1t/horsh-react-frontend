import { type PropsWithChildren } from 'react'

import { OfflineIndicator } from 'shared/components/OfflineIndicator'
import { PendingSyncBanner } from 'shared/components/PendingSyncBanner'

export const MainLayout = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <div className='h-dvh w-full flex flex-col bg-gray-900 text-white'>
      <OfflineIndicator />
      <PendingSyncBanner />
      <div className='flex-1 overflow-auto'>{children}</div>
    </div>
  )
}

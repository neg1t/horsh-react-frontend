import { useUnit } from 'effector-react'
import { WifiOff } from 'lucide-react'

import { networkModel } from 'shared/lib/network'

export const OfflineIndicator = () => {
  const isOnline = useUnit(networkModel.stores.$isOnline)

  if (isOnline) return null

  return (
    <div className='flex items-center justify-center gap-2 bg-amber-600 text-white px-4 py-2 text-sm font-medium shrink-0'>
      <WifiOff size={16} />
      <span>Вы работаете в офлайн-режиме</span>
    </div>
  )
}

import { useUnit } from 'effector-react'
import { CloudUpload } from 'lucide-react'

import { offlineSyncModel } from 'shared/lib/offline-sync'

export const PendingSyncBanner = () => {
  const hasPending = useUnit(offlineSyncModel.stores.$hasPendingOperations)

  if (!hasPending) return null

  const label = 'У вас есть несинхронизированные заказы'

  return (
    <div className='flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 text-sm font-medium shrink-0'>
      <div className='flex items-center gap-2'>
        <CloudUpload size={16} />
        <span>{label}</span>
      </div>
    </div>
  )
}

import { useUnit } from 'effector-react'
import { CloudUpload, Loader2 } from 'lucide-react'

import { Button } from 'shared/components/ui/button'
import { networkModel } from 'shared/lib/network'
import { offlineSyncModel } from 'shared/lib/offline-sync'

export const PendingSyncBanner = () => {
  const [isOnline, hasPending, pendingCount, isSyncing, pendingOps] = useUnit([
    networkModel.stores.$isOnline,
    offlineSyncModel.stores.$hasPendingOperations,
    offlineSyncModel.stores.$pendingCount,
    offlineSyncModel.stores.$isSyncing,
    offlineSyncModel.stores.$pendingOperations,
  ])

  const syncAll = useUnit(offlineSyncModel.effects.syncAllPendingFx)

  if (!hasPending) return null

  const handleSync = () => {
    syncAll(pendingOps)
  }

  const label =
    pendingCount === 1
      ? 'У вас есть 1 несинхронизированная операция'
      : `У вас есть ${pendingCount} несинхронизированных операций`

  return (
    <div className='flex items-center justify-between gap-2 bg-blue-600 text-white px-4 py-2 text-sm font-medium shrink-0'>
      <div className='flex items-center gap-2'>
        <CloudUpload size={16} />
        <span>{label}</span>
      </div>

      {isOnline && (
        <Button
          size='sm'
          variant='secondary'
          onClick={handleSync}
          disabled={isSyncing}
          className='ml-2 shrink-0'
        >
          {isSyncing ? (
            <>
              <Loader2 size={14} className='animate-spin mr-1' />
              Синхронизация...
            </>
          ) : (
            'Синхронизировать'
          )}
        </Button>
      )}
    </div>
  )
}

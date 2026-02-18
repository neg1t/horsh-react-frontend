import { type FC } from 'react'

import { useGate, useUnit } from 'effector-react'
import { FileWarning, RefreshCcw } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from 'shared/components/ui/button'
import { AppRoutes } from 'shared/config/routes'
import type { PendingOperation } from 'shared/lib/indexed-db/types'
import { networkModel } from 'shared/lib/network'

import { orderListModel } from '../model/orderListModel'

export const MainPage: FC = () => {
  const orderList = useUnit(orderListModel.stores.$orders)
  const pendingOperations = useUnit(orderListModel.stores.$pendingOperations)

  const isOnline = useUnit(networkModel.stores.$isOnline)

  const loading = useUnit(orderListModel.loadings.uploadOperationPending)

  const uploadToServer = useUnit(
    orderListModel.effects.uploadOperationToServerFx,
  )

  const handleUploadToServer = (op: PendingOperation) => () => {
    uploadToServer(op)
  }

  useGate(orderListModel.gates.OrderListGate)

  return (
    <div className='flex flex-col m-4 overflow-auto'>
      <h1 className='text-2xl font-bold text-center mb-8'>
        Welcome to Horsch Project
      </h1>

      {orderList.map((order) => (
        <div
          key={order.id}
          className='border rounded-xl p-4 mb-4 bg-white shadow-sm text-black hover:cursor-pointer hover:shadow-md transition-shadow'
        >
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Order Name:</strong> {order.name}
          </p>
        </div>
      ))}

      {pendingOperations.map((op) => (
        <div
          key={op.id}
          className='border rounded-xl p-4 mb-4 bg-yellow-100 shadow-sm text-black hover:cursor-pointer hover:shadow-md transition-shadow relative'
        >
          <p>
            <strong>Pending Order ID:</strong> {op.id}
          </p>
          <p>
            <strong>Order Name:</strong> {op.payload.name}
          </p>

          <div className='absolute top-2 right-2 flex items-center gap-1'>
            <FileWarning style={{ color: 'red' }} />

            {isOnline && (
              <Button
                variant='outline'
                onClick={handleUploadToServer(op)}
                disabled={loading}
              >
                <RefreshCcw
                  className={loading ? 'animate-spin blur-[1px]' : ''}
                  color='blue'
                />
              </Button>
            )}
          </div>
        </div>
      ))}

      <Button asChild>
        <Link to={AppRoutes.CreateOrder.path}>Create new order</Link>
      </Button>
    </div>
  )
}

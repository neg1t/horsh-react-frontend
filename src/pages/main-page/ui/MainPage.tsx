import { type FC } from 'react'

import { useGate, useUnit } from 'effector-react'
import { Link } from 'react-router-dom'

import { Button } from 'shared/components/ui/button'
import { AppRoutes } from 'shared/config/routes'

import { orderListModel } from '../model/orderListModel'

export const MainPage: FC = () => {
  const orderList = useUnit(orderListModel.stores.$orders)

  useGate(orderListModel.gates.OrderListGate)

  return (
    <div className='flex flex-col m-4 overflow-auto'>
      <h1 className='text-2xl font-bold text-center mb-8'>
        Welcome to Horsh Project
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

      <Button asChild>
        <Link to={AppRoutes.CreateOrder.path}>Create new order</Link>
      </Button>
    </div>
  )
}

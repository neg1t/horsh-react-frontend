import { type PropsWithChildren } from 'react'

export const MainLayout = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <div className='h-dvh w-full flex flex-col bg-gray-900 text-white'>
      {children}
    </div>
  )
}

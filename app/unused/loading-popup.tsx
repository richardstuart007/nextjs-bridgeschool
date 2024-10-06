import { useState, ReactNode, FC } from 'react'
import { useTimeout } from './use-timeout'

interface LoadingPopupProps {
  children: ReactNode
  delayMs?: number
}

export const LoadingPopup: FC<LoadingPopupProps> = ({ children, delayMs = 0 }) => {
  let [isShowing, setIsShowing] = useState(!delayMs)
  useTimeout(() => setIsShowing(true), delayMs)

  return (
    isShowing && (
      <div className='fixed bottom-0 right-0 z-20 flex items-center justify-center px-4 py-2 mb-4 mr-4 text-white rounded shadow bg-emerald-600'>
        {children}
      </div>
    )
  )
}

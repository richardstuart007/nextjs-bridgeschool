import NavSide from '@/app/ui/dashboard/nav/nav-side'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard'
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen flex-col md:flex-row '>
      <div className='w-full flex-none md:w-64'>
        <NavSide />
      </div>
      <div className='flex-grow overflow-hidden whitespace-nowrap'>{children}</div>
    </div>
  )
}

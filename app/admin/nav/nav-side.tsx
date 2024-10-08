'use client'
import NavLinks from '@/app/admin/nav/nav-links'
import SchoolLogo from '@/app/ui/utils/school-logo'
import { PowerIcon } from '@heroicons/react/24/outline'
import { logout } from '@/app/lib/actions/user-logout'

export default function NavSide() {
  //--------------------------------------------------------------------------------
  return (
    <div className='flex h-full flex-col px-3 py-2 md:px-2'>
      <SchoolLogo />

      <>
        <div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
          <NavLinks />
          <div className='hidden h-auto w-full grow rounded-md bg-gray-50 md:block'></div>
          <form action={logout}>
            <button className='flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'>
              <PowerIcon className='w-6' />
              <div className='hidden md:block'>Sign Out</div>
            </button>
          </form>
        </div>
      </>
    </div>
  )
}

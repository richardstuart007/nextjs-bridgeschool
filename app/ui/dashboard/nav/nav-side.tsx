'use client'
import { useEffect } from 'react'
import NavLinks from '@/app/ui/dashboard/nav/nav-links'
import NavSession from '@/app/ui/dashboard/nav/nav-session'
import SchoolLogo from '@/app/ui/utils/school-logo'
import { PowerIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useUserContext } from '@/UserContext'
import { fetchBSsession } from '@/app/lib/data'
import { BS_session } from '@/app/lib/definitions'
import { serverSignout } from '@/app/lib/actions'

export default function NavSide() {
  //
  //  Router
  //
  const router = useRouter()
  //
  //  User context
  //
  const { session, setSession } = useUserContext()
  //
  //  Change of pathname - Get session info
  //
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    getSessionInfo()
    // eslint-disable-next-line
  }, [pathname])
  //--------------------------------------------------------------------------------
  //  Change of pathname
  //--------------------------------------------------------------------------------
  async function getSessionInfo() {
    //
    //  Auth redirect error - fix ???
    //
    if (!pathname.includes('/dashboard')) {
      console.log('nav-side: Auth redirect but not /dashboard')
      router.push(pathname)
      return
    }
    //
    //  Search Parameters
    //
    const sessionId = searchParams.get('sessionId')
    //
    //  Get Session info from database & update Context
    //
    if (sessionId) {
      const bsid = parseInt(sessionId, 10)
      const BSsession: BS_session = await fetchBSsession(bsid)
      setSession(BSsession)
    }
  }
  //--------------------------------------------------------------------------------
  return (
    <div className='flex h-full flex-col px-3 py-2 md:px-2'>
      <SchoolLogo />
      <NavSession />
      <div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        <NavLinks />
        <div className='hidden h-auto w-full grow rounded-md bg-gray-50 md:block'></div>
        <form action={serverSignout}>
          <button className='flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'>
            <PowerIcon className='w-6' />
            <div className='hidden md:block'>Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  )
}

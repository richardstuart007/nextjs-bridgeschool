'use client'
import { useEffect } from 'react'
import { getCookieClient } from '@/app/lib/utilsClient'
import { BSsessionTable } from '@/app/lib/definitions'
import { usePathname, useRouter } from 'next/navigation'
import { useUserContext } from '@/UserContext'

export default function NavSession() {
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
  useEffect(() => {
    getSessionInfo()
    // eslint-disable-next-line
  }, [pathname])
  //--------------------------------------------------------------------------------
  //  Every Time
  //--------------------------------------------------------------------------------
  function getSessionInfo() {
    //
    //  Auth redirect error - fix ???
    //
    if (!pathname.includes('/dashboard')) {
      router.push('/dashboard')
      return
    }
    //
    //  Get session info
    //
    const data: BSsessionTable | null = getCookieClient()
    if (!data) return
    //
    //  Update the Context
    //
    setSession(data)
  }
  //--------------------------------------------------------------------------------
  return (
    <>
      {/*  Mobile  */}
      <div className=' md:hidden mb-2 h-8 rounded-md bg-green-600 p-2 md:h-16'>
        <div className='flex flex-row justify-between text-white md:w-50'>
          <h1>{`Session: ${session?.bsid}`}</h1>
          <h1>{`User: ${session?.bsuid}`}</h1>
          <h1>{session?.bsname}</h1>
        </div>
      </div>
      {/*  Desktop  */}
      <div className='hidden md:block mb-2 h-8 rounded-md bg-green-600 p-2 md:h-16'>
        <div className='flex flex-row justify-between text-white md:w-50'>
          <h1>{`Session: ${session?.bsid}`}</h1>
          <h1>{`User: ${session?.bsuid}`}</h1>
        </div>
        <div className='w-48 text-white md:w-50'>
          <h1>{session?.bsname}</h1>
        </div>
      </div>
    </>
  )
}

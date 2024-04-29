'use client'
import { useEffect, useState } from 'react'
import { getSession_BS_session } from '@/app/lib/utilsClient'
import { BSsessionTable } from '@/app/lib/definitions'
import { usePathname, useRouter } from 'next/navigation'

export default function Session() {
  const [userSession, setUserSessionTable] = useState<BSsessionTable>(null)
  //
  //  Router
  //
  const router = useRouter()
  //
  //  Get Pathname
  //
  const pathname = usePathname()
  //
  //  Change of pathname
  //
  useEffect(() => {
    pathChange()
    // eslint-disable-next-line
  }, [pathname])
  //--------------------------------------------------------------------------------
  //  Every Time
  //--------------------------------------------------------------------------------
  function pathChange() {
    //
    //  Auth redirect error - fix ???
    //
    if (!pathname.includes('/dashboard')) {
      console.log('Session: The URL does NOT contain /dashboard.')
      router.push('/dashboard')
      return
    }
    //
    //  Get session info
    //
    const data: BSsessionTable | null = getSession_BS_session()
    if (!data) return
    setUserSessionTable(data)
  }

  return (
    <div className='mb-2 h-8 rounded-md bg-green-600 p-2 md:h-16'>
      <div className='flex flex-row justify-between text-white md:w-50'>
        <h1>{`Session: ${userSession?.usid}`}</h1>
        <h1>{`User: ${userSession?.u_uid}`}</h1>
      </div>

      <div className='w-48 text-white md:w-50'>
        <h1>{userSession?.u_name}</h1>
      </div>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { getSession_BSuser } from '@/app/lib/utilsClient'
import { BSuserTable } from '@/app/lib/definitions'
export default function Session() {
  const [userSession, setUserSessionTable] = useState<BSuserTable>(null)

  useEffect(() => {
    //
    //  Get session info
    //
    const data: BSuserTable | null = getSession_BSuser()
    if (!data) return
    setUserSessionTable(data)
    // eslint-disable-next-line
  }, [])

  return (
    <div className='mb-2 flex h-4 items-end justify-center rounded-md bg-green-600 p-2 md:h-8'>
      <h1 className='w-32 text-white md:w-40'>{`Session: ${userSession?.usid}`}</h1>
    </div>
  )
}

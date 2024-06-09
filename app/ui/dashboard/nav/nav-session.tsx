'use client'
import { useUserContext } from '@/UserContext'

export default function NavSession() {
  //
  //  User context
  //
  const { session } = useUserContext()

  return (
    <>
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

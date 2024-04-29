'use client'

import { useEffect } from 'react'
import { lusitana } from '@/app/ui/fonts'
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/20/solid'
import { Button } from '../button'
import { useFormState, useFormStatus } from 'react-dom'
import { authenticate } from '@/app/lib/actions'
import { usePathname, useRouter } from 'next/navigation'

export default function LoginForm() {
  //
  //  Router
  //
  const router = useRouter()
  //
  //  Get Pathname
  //
  const pathname = usePathname()
  //
  //  State
  //
  const [errorMessage, dispatch] = useFormState(authenticate, undefined)
  //
  //  One time only
  //
  useEffect(() => {
    firstTime()
    // eslint-disable-next-line
  }, [])
  //
  //  Change of pathname
  //
  useEffect(() => {
    pathChange()
    // eslint-disable-next-line
  }, [pathname])
  //--------------------------------------------------------------------------------
  //  First Time
  //--------------------------------------------------------------------------------
  function firstTime() {
    //
    //  Remove session storage
    //
    const storeName = 'BS_session'
    const data = sessionStorage.getItem(storeName)
    if (data) {
      sessionStorage.removeItem(storeName)
      console.log('Session storage deleted')
    }
    //
    //  Remove cookies
    //
    document.cookie = `${storeName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    console.log('Cookie deleted')
  }
  //--------------------------------------------------------------------------------
  //  Every Time
  //--------------------------------------------------------------------------------
  function pathChange() {
    //
    //  Auth redirect error - fix ???
    //
    if (!pathname.includes('/login')) {
      console.log('LoginForm: The URL does NOT contain /login.')
      router.push('/login')
    }
  }
  //-------------------------------------------------------------------------
  //  Login Button
  //-------------------------------------------------------------------------
  function LoginButton() {
    const { pending } = useFormStatus()
    return (
      <Button className='mt-4 w-full' aria-disabled={pending}>
        Login <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
      </Button>
    )
  }
  //-------------------------------------------------------------------------
  //  Go to Register
  //-------------------------------------------------------------------------
  interface RegisterButtonProps {
    onClick: () => void
  }
  function RegisterButton({ onClick }: RegisterButtonProps) {
    return (
      <Button
        className='mt-4 w-full flex items-center justify-between bg-gray-400 hover:bg-gray-300'
        onClick={onClick}
      >
        <ArrowLeftIcon className=' h-5 w-5 text-gray-50' /> Register
      </Button>
    )
  }
  //--------------------------------------------------------------------------------
  //  Register User
  //--------------------------------------------------------------------------------
  function handleRegisterClick() {
    router.push('/register')
  }
  return (
    <form action={dispatch} className='space-y-3'>
      <div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>Login to continue.</h1>
        <div className='w-full'>
          <div>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='email'>
              Email
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                id='email'
                type='email'
                name='email'
                placeholder='Enter your email address'
                autoComplete='email'
                required
              />
              <AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>
          <div className='mt-4'>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='password'>
              Password
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                id='password'
                type='password'
                name='password'
                placeholder='Enter password'
                autoComplete='current-password'
                required
              />
              <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>
        </div>
        <LoginButton />
        <RegisterButton onClick={handleRegisterClick} />

        <div className='flex h-8 items-end space-x-1' aria-live='polite' aria-atomic='true'>
          {errorMessage && (
            <>
              <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
              <p className='text-sm text-red-500'>{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  )
}

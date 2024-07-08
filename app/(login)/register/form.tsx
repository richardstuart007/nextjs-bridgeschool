'use client'

import { lusitana } from '@/app/ui/fonts'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '../../ui/utils/button'
import { useFormState, useFormStatus } from 'react-dom'
import { registerUser } from '@/app/lib/actions/user-register'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const initialState = { message: null, errors: {} }
  const [formState, formAction] = useFormState(registerUser, initialState)
  const errorMessage = formState?.message || null
  //
  //  Get Router
  //
  const router = useRouter()
  //-------------------------------------------------------------------------
  //  Register
  //-------------------------------------------------------------------------
  function RegisterButton() {
    const { pending } = useFormStatus()
    return (
      <Button className='mt-4 w-full flex justify-center' aria-disabled={pending}>
        Register
      </Button>
    )
  }
  //-------------------------------------------------------------------------
  //  Go to Login
  //-------------------------------------------------------------------------
  interface LoginButtonProps {
    onClick: () => void
  }
  function LoginButton({ onClick }: LoginButtonProps) {
    return (
      <Button
        className='mt-4 w-full flex items-center justify-center bg-gray-300 border-none shadow-noneunderline  hover:bg-gray-500'
        onClick={onClick}
      >
        Back to Login, Click here
      </Button>
    )
  }
  //-------------------------------------------------------------------------
  //  Handle Login Click
  //-------------------------------------------------------------------------
  const handleLoginClick = () => {
    router.push('/login')
  }
  //-------------------------------------------------------------------------
  return (
    <form action={formAction} className='space-y-3'>
      <div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>Register</h1>
        {/* -------------------------------------------------------------------------------- */}
        {/* email   */}
        {/* -------------------------------------------------------------------------------- */}
        <div>
          <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='email'>
            Email
          </label>
          <div className='relative'>
            <input
              className='peer block w-full rounded-md border border-gray-200 py-[9px]  text-sm outline-2 placeholder:text-gray-500'
              id='email'
              type='email'
              name='email'
              placeholder='Enter your email address'
              autoComplete='email'
              required
            />
          </div>
        </div>
        {/* -------------------------------------------------------------------------------- */}
        {/* password                                                                         */}
        {/* -------------------------------------------------------------------------------- */}
        <div className='mt-4'>
          <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='password'>
            Password
          </label>
          <div className='relative'>
            <input
              className='peer block w-full rounded-md border border-gray-200 py-[9px]  text-sm outline-2 placeholder:text-gray-500'
              id='password'
              type='password'
              name='password'
              placeholder='Enter password'
              autoComplete='new-password'
              required
            />
          </div>
        </div>
        {/* -------------------------------------------------------------------------------- */}
        {/* buttons */}
        {/* -------------------------------------------------------------------------------- */}
        <RegisterButton />
        <LoginButton onClick={handleLoginClick} />
        {/* -------------------------------------------------------------------------------- */}
        {/* Errors                                                */}
        {/* -------------------------------------------------------------------------------- */}
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

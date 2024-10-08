'use client'

import { lusitana } from '@/app/ui/fonts'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '../../ui/utils/button'
import { useFormState } from 'react-dom'
import { registerUser } from '@/app/lib/actions/user-register'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function RegisterForm() {
  const initialState = { message: null, errors: {} }
  const [formState, formAction] = useFormState(registerUser, initialState)
  const errorMessage = formState?.message || null
  //
  //  Get Router
  //
  const router = useRouter()
  //
  // Local state to manage submitting status
  //
  const [submitting, setSubmitting] = useState(false)
  //
  //  Error message on submission
  //
  useEffect(() => {
    if (errorMessage) setSubmitting(false)
  }, [errorMessage])
  //-------------------------------------------------------------------------
  //  Register
  //-------------------------------------------------------------------------
  function RegisterButton() {
    return (
      <Button className='mt-4 w-full flex justify-center' disabled={submitting} type='submit'>
        {submitting ? 'submitting...' : 'Register'}
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
        Back to Login
      </Button>
    )
  }
  //-------------------------------------------------------------------------
  //  Handle Login Click
  //-------------------------------------------------------------------------
  const onClick_login = () => {
    router.push('/login')
  }
  //-------------------------------------------------------------------------
  //  Handle Register
  //-------------------------------------------------------------------------
  const onSubmit_register = () => {
    setSubmitting(true)
    if (formState) formState.message = null
  }
  //-------------------------------------------------------------------------
  return (
    <form action={formAction} className='space-y-3' onSubmit={onSubmit_register}>
      <div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
        <h1 className={`${lusitana.className} mb-3 text-2xl text-orange-500`}>Register</h1>
        {/* -------------------------------------------------------------------------------- */}
        {/* name   */}
        {/* -------------------------------------------------------------------------------- */}
        <div>
          <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='name'>
            Name
          </label>
          <div className='relative'>
            <input
              className='peer block w-full rounded-md border border-gray-200 py-[9px]  text-sm outline-2 placeholder:text-gray-500'
              id='name'
              type='text'
              name='name'
              placeholder='Enter your name'
              required
              disabled={submitting}
            />
          </div>
        </div>
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
              required
              disabled={submitting}
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
              required
              disabled={submitting}
            />
          </div>
        </div>
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
        {/* -------------------------------------------------------------------------------- */}
        {/* buttons */}
        {/* -------------------------------------------------------------------------------- */}
        <RegisterButton />
        {!submitting && <LoginButton onClick={onClick_login} />}
      </div>
    </form>
  )
}

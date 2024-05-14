'use client'
import { useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '../button'
import { useFormState, useFormStatus } from 'react-dom'
import { preferencesUser } from '@/app/lib/actions'
import { useRouter } from 'next/navigation'
import type { UsersTable } from '@/app/lib/definitions'

export default function PreferencesForm({ UserRecord }: { UserRecord: UsersTable }) {
  const initialState = { message: null, errors: {} }
  const [statePreferences, dispatch] = useFormState(preferencesUser, initialState)
  const [u_uid, setU_uid] = useState(UserRecord.u_uid)
  const [u_name, setU_name] = useState(UserRecord.u_name)
  const [u_fedid, setU_fedid] = useState(UserRecord.u_fedid)
  const [u_fedcountry, setU_fedcountry] = useState(UserRecord.u_fedcountry)
  const [u_dftmaxquestions, setU_dftmaxquestions] = useState(UserRecord.u_dftmaxquestions)
  //
  //  Get Router
  //
  const router = useRouter()
  //-------------------------------------------------------------------------
  //  Preferences
  //-------------------------------------------------------------------------
  function PreferencesButton() {
    const { pending } = useFormStatus()
    return (
      <Button className='mt-4 w-full' aria-disabled={pending}>
        Update
      </Button>
    )
  }
  //-------------------------------------------------------------------------
  return (
    <form action={dispatch} className='space-y-3 '>
      <div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
        <div className='w-full'>
          <div>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='u_uid'>
              ID {u_uid}
            </label>
            <div className='relative'>
              <input
                className='w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2'
                id='u_uid'
                type='hidden'
                name='u_uid'
                value={u_uid}
              />
            </div>
          </div>

          <div>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='u_name'>
              Name
            </label>
            <div className='relative'>
              <input
                className='w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2'
                id='u_name'
                type='u_name'
                name='u_name'
                autoComplete='u_name'
                required
                value={u_name}
                onChange={e => setU_name(e.target.value)}
              />
            </div>
          </div>
          <div id='name-error' aria-live='polite' aria-atomic='true'>
            {statePreferences.errors?.u_name &&
              statePreferences.errors.u_name.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>

          <div className='mt-4'>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='u_fedid'>
              Bridge Federation ID
            </label>
            <div className='relative'>
              <input
                className='w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2'
                id='u_fedid'
                type='u_fedid'
                name='u_fedid'
                autoComplete='u_fedid'
                required
                value={u_fedid}
                onChange={e => setU_fedid(e.target.value)}
              />
            </div>
          </div>
          <div id='fedid-error' aria-live='polite' aria-atomic='true'>
            {statePreferences.errors?.u_fedid &&
              statePreferences.errors.u_fedid.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>

          <div className='mt-4'>
            <label
              className='mb-3 mt-5 block text-xs font-medium text-gray-900'
              htmlFor='u_fedcountry'
            >
              Bridge Federation Country
            </label>
            <div className='relative'>
              <input
                className='w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2'
                id='u_fedcountry'
                type='u_fedcountry'
                name='u_fedcountry'
                autoComplete='u_fedcountry'
                required
                value={u_fedcountry}
                onChange={e => setU_fedcountry(e.target.value)}
              />
            </div>
          </div>
          <div id='fedcountry-error' aria-live='polite' aria-atomic='true'>
            {statePreferences.errors?.u_fedcountry &&
              statePreferences.errors.u_fedcountry.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>

          <div className='mt-4'>
            <label
              className='mb-3 mt-5 block text-xs font-medium text-gray-900'
              htmlFor='u_dftmaxquestions'
            >
              Maximun Number of Questions
            </label>
            <div className='relative'>
              <input
                className='w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2'
                id='u_dftmaxquestions'
                type='number'
                name='u_dftmaxquestions'
                autoComplete='u_dftmaxquestions'
                required
                value={u_dftmaxquestions}
                onChange={e => setU_dftmaxquestions(Number(e.target.value))}
              />
            </div>
          </div>
          <div id='u_dftmaxquestions-error' aria-live='polite' aria-atomic='true'>
            {statePreferences.errors?.u_dftmaxquestions &&
              statePreferences.errors.u_dftmaxquestions.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        <PreferencesButton />

        <div className='flex h-8 items-end space-x-1' aria-live='polite' aria-atomic='true'>
          {statePreferences.message && (
            <>
              <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
              <p className='text-sm text-red-500'>{statePreferences.message}</p>
            </>
          )}
        </div>
      </div>
    </form>
  )
}

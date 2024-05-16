'use client'
import { useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '../utils/button'
import { useFormState, useFormStatus } from 'react-dom'
import { preferencesUser } from '@/app/lib/actions'
import type { UsersTable } from '@/app/lib/definitions'
import SelectCountry from './select-country'

export default function PreferencesForm({ UserRecord }: { UserRecord: UsersTable }) {
  const initialState = { message: null, errors: {} }
  const [statePreferences, dispatch] = useFormState(preferencesUser, initialState)
  const [u_name, setU_name] = useState(UserRecord.u_name)
  const [u_fedid, setU_fedid] = useState(UserRecord.u_fedid)
  const [u_fedcountry, setU_fedcountry] = useState(UserRecord.u_fedcountry)
  const [u_dftmaxquestions, setU_dftmaxquestions] = useState(UserRecord.u_dftmaxquestions)
  const [u_skipcorrect, setU_skipCorrect] = useState(UserRecord.u_skipcorrect)
  const [u_sortquestions, setU_sortquestions] = useState(UserRecord.u_sortquestions)
  const u_uid = UserRecord.u_uid
  const u_email = UserRecord.u_email
  //-------------------------------------------------------------------------
  //  Preferences
  //-------------------------------------------------------------------------
  function PreferencesButton() {
    const { pending } = useFormStatus()
    return (
      <Button className='mt-4 w-72 md:max-w-md px-4' aria-disabled={pending}>
        Update
      </Button>
    )
  }
  //...................................................................................
  //.  Select Country
  //...................................................................................
  function handleSelectCountry(CountryCode: string) {
    //
    //  Update values
    //
    setU_fedcountry(CountryCode)
  }
  //-------------------------------------------------------------------------
  return (
    <form action={dispatch} className='space-y-3 '>
      <div className='flex-1 rounded-lg bg-gray-50 px-4 pb-2 pt-2 max-w-md'>
        <div className=''>
          {/*  ...................................................................................*/}
          {/*  User ID  */}
          {/*  ...................................................................................*/}
          <div>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='u_uid'>
              ID:{u_uid} Email:{u_email}
            </label>
            <div className='relative'>
              <input id='u_uid' type='hidden' name='u_uid' value={u_uid} />
            </div>
          </div>
          {/*  ...................................................................................*/}
          {/*  Name */}
          {/*  ...................................................................................*/}
          <div>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='u_name'>
              Name
            </label>
            <div className='relative'>
              <input
                className='w-72 md:max-w-md px-4 rounded-md border border-blue-500 py-[9px] text-sm '
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
          {/*  ...................................................................................*/}
          {/*  FEDID  */}
          {/*  ...................................................................................*/}
          <div className='mt-4'>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='u_fedid'>
              Bridge Federation ID
            </label>
            <div className='relative'>
              <input
                className='w-72 md:max-w-md px-4 rounded-md border border-blue-500 py-[9px] text-sm '
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
          {/*  ...................................................................................*/}
          {/*  FEDCOUNTRY  */}
          {/*  ...................................................................................*/}
          <div className='mt-4'>
            <label
              className='mb-3 mt-5 block text-xs font-medium text-gray-900'
              htmlFor='u_fedcountry'
            >
              Bridge Federation Country ({u_fedcountry})
            </label>
            <input
              className='w-72 md:max-w-md px-4 rounded-md border border-blue-500 py-[9px] text-sm '
              id='u_fedcountry'
              type='hidden'
              name='u_fedcountry'
              value={u_fedcountry}
            />
            <SelectCountry onChange={handleSelectCountry} countryCode={u_fedcountry ?? ''} />
          </div>
          {/*  ...................................................................................*/}
          {/*  MAX QUESTIONS  */}
          {/*  ...................................................................................*/}
          <div className='mt-4'>
            <label
              className='mb-3 mt-5 block text-xs font-medium text-gray-900'
              htmlFor='u_dftmaxquestions'
            >
              Maximum Number of Questions
            </label>
            <div className='relative'>
              <input
                className='w-72 md:max-w-md px-4 rounded-md border border-blue-500 py-[9px] text-sm '
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
        {/*  ...................................................................................*/}
        {/*   Toggle - SKIP Correct */}
        {/*  ...................................................................................*/}
        <div className='mt-4 flex items-center justify-end w-72'>
          <div className='mr-auto block text-xs font-medium text-gray-900'>
            Skip Correct on Review
          </div>
          <label className='inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              id='u_skipcorrect'
              className='sr-only peer'
              name='u_skipcorrect'
              checked={u_skipcorrect}
              onChange={() => setU_skipCorrect(prev => !prev)}
              value={u_skipcorrect ? 'true' : 'false'}
            />
            {/* prettier-ignore */}
            <div
            className="
              relative
              w-11 h-6
              bg-gray-400
              rounded-full
              peer
              dark:bg-gray-700
              peer-checked:after:translate-x-full
              rtl:peer-checked:after:-translate-x-full
              peer-checked:after:border-white
              after:content-['']
              after:absolute
              after:top-0.5
              after:start-[2px]
              after:bg-white
              after:border-gray-300
              after:border
              after:rounded-full
              after:h-5
              after:w-5
              after:transition-all
              dark:border-gray-600
              peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>
        {/*  ...................................................................................*/}
        {/*   Toggle - Random Sort questions */}
        {/*  ...................................................................................*/}
        <div className='mt-4 flex items-center justify-end w-72'>
          <div className='mr-auto block text-xs font-medium text-gray-900'>
            Random Sort Questions
          </div>
          <label className='inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              id='u_sortquestions'
              className='sr-only peer'
              name='u_sortquestions'
              checked={u_sortquestions}
              onChange={() => setU_sortquestions(prev => !prev)}
              value={u_sortquestions ? 'true' : 'false'}
            />
            {/* prettier-ignore */}
            <div
            className="
              relative
              w-11 h-6
              bg-gray-400
              rounded-full
              peer
              dark:bg-gray-700
              peer-checked:after:translate-x-full
              rtl:peer-checked:after:-translate-x-full
              peer-checked:after:border-white
              after:content-['']
              after:absolute
              after:top-0.5
              after:start-[2px]
              after:bg-white
              after:border-gray-300
              after:border
              after:rounded-full
              after:h-5
              after:w-5
              after:transition-all
              dark:border-gray-600
              peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>
        {/*  ...................................................................................*/}
        {/*   Update Button */}
        {/*  ...................................................................................*/}
        <PreferencesButton />
        {/*  ...................................................................................*/}
        {/*   Error Messages */}
        {/*  ...................................................................................*/}
        <div className='flex h-8 items-end space-x-1' aria-live='polite' aria-atomic='true'>
          {statePreferences.message && (
            <>
              <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
              <p className='text-sm text-red-500'>{statePreferences.message}</p>
            </>
          )}
        </div>
        {/*  ...................................................................................*/}
      </div>
    </form>
  )
}

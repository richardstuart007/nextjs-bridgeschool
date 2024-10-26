'use client'
import { useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '@/app/ui/utils/button'
import { useFormState, useFormStatus } from 'react-dom'
import { LibraryAdd } from '@/app/lib/actions/admin-library-add'

export default function Form() {
  const initialState = { message: null, errors: {} }
  const [formState, formAction] = useFormState(LibraryAdd, initialState)
  const [lrdesc, setLrdesc] = useState('')
  const [lrwho, setLrwho] = useState('')
  const [lrtype, setLrtype] = useState('')
  const [lrowner, setLrowner] = useState('')
  const [lrref, setLrref] = useState('')
  const [lrgroup, setLrgroup] = useState('')
  //-------------------------------------------------------------------------
  //  Update Button
  //-------------------------------------------------------------------------
  function UpdateButton() {
    const { pending } = useFormStatus()
    return (
      <Button className='mt-4 w-72 md:max-w-md px-4' aria-disabled={pending}>
        Create
      </Button>
    )
  }
  //-------------------------------------------------------------------------
  return (
    <form action={formAction} className='space-y-3 '>
      <div className='flex-1 rounded-lg bg-gray-50 px-4 pb-2 pt-2 max-w-md'>
        <div className=''>
          {/*  ...................................................................................*/}
          {/*  Description */}
          {/*  ...................................................................................*/}
          <div>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='lrdesc'>
              Description
            </label>
            <div className='relative'>
              <input
                className='w-72 md:max-w-md px-4 rounded-md border border-blue-500 py-[9px] text-sm '
                id='lrdesc'
                type='lrdesc'
                name='lrdesc'
                autoComplete='lrdesc'
                required
                value={lrdesc}
                onChange={e => setLrdesc(e.target.value)}
              />
            </div>
          </div>
          <div id='name-error' aria-live='polite' aria-atomic='true'>
            {formState.errors?.lrdesc &&
              formState.errors.lrdesc.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
          {/*  ...................................................................................*/}
          {/*  Who  */}
          {/*  ...................................................................................*/}
          <div className='mt-4'>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='lrwho'>
              Who
            </label>
            <div className='relative'>
              <input
                className='w-72 md:max-w-md px-4 rounded-md border border-blue-500 py-[9px] text-sm '
                id='lrwho'
                type='lrwho'
                name='lrwho'
                autoComplete='lrwho'
                value={lrwho}
                onChange={e => setLrwho(e.target.value)}
              />
            </div>
          </div>
          <div id='fedid-error' aria-live='polite' aria-atomic='true'>
            {formState.errors?.lrwho &&
              formState.errors.lrwho.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
          {/*  ...................................................................................*/}
          {/*  Type  */}
          {/*  ...................................................................................*/}
          <div className='mt-4'>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='lrtype'>
              Type
            </label>
            <div className='relative'>
              <input
                className='w-72 md:max-w-md px-4 rounded-md border border-blue-500 py-[9px] text-sm '
                id='lrtype'
                type='lrtype'
                name='lrtype'
                autoComplete='lrtype'
                value={lrtype}
                onChange={e => setLrtype(e.target.value)}
              />
            </div>
          </div>
          <div id='fedid-error' aria-live='polite' aria-atomic='true'>
            {formState.errors?.lrtype &&
              formState.errors.lrtype.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
          {/*  ...................................................................................*/}
          {/*   Owner */}
          {/*  ...................................................................................*/}
          <div className='mt-4'>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='lrowner'>
              Owner
            </label>
            <div className='relative'>
              <input
                className='w-72 md:max-w-md px-4 rounded-md border border-blue-500 py-[9px] text-sm '
                id='lrowner'
                type='lrowner'
                name='lrowner'
                autoComplete='lrowner'
                value={lrowner}
                onChange={e => setLrowner(e.target.value)}
              />
            </div>
          </div>
          <div id='fedid-error' aria-live='polite' aria-atomic='true'>
            {formState.errors?.lrowner &&
              formState.errors.lrowner.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
          {/*  ...................................................................................*/}
          {/*   Reference */}
          {/*  ...................................................................................*/}
          <div className='mt-4'>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='lrref'>
              Reference
            </label>
            <div className='relative'>
              <input
                className='w-72 md:max-w-md px-4 rounded-md border border-blue-500 py-[9px] text-sm '
                id='lrref'
                type='lrref'
                name='lrref'
                autoComplete='lrref'
                value={lrref}
                onChange={e => setLrref(e.target.value)}
              />
            </div>
          </div>
          <div id='fedid-error' aria-live='polite' aria-atomic='true'>
            {formState.errors?.lrref &&
              formState.errors.lrref.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
          {/*  ...................................................................................*/}
          {/*   Group */}
          {/*  ...................................................................................*/}
          <div className='mt-4'>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='lrgroup'>
              Group
            </label>
            <div className='relative'>
              <input
                className='w-72 md:max-w-md px-4 rounded-md border border-blue-500 py-[9px] text-sm '
                id='lrgroup'
                type='lrgroup'
                name='lrgroup'
                autoComplete='lrgroup'
                value={lrgroup}
                onChange={e => setLrgroup(e.target.value)}
              />
            </div>
          </div>
          <div id='fedid-error' aria-live='polite' aria-atomic='true'>
            {formState.errors?.lrgroup &&
              formState.errors.lrgroup.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
          {/*  ...................................................................................*/}
          {/*   Update Button */}
          {/*  ...................................................................................*/}
          <UpdateButton />
          {/*  ...................................................................................*/}
          {/*   Error Messages */}
          {/*  ...................................................................................*/}
          <div className='flex h-8 items-end space-x-1' aria-live='polite' aria-atomic='true'>
            {formState.message && (
              <>
                <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
                <p className='text-sm text-red-500'>{formState.message}</p>
              </>
            )}
          </div>
          {/*  ...................................................................................*/}
        </div>
      </div>
    </form>
  )
}

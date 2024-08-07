'use client'
import { useState, useEffect } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '@/app/ui/utils/button'
import { useFormState, useFormStatus } from 'react-dom'
import { sessionUser } from '@/app/lib/actions/session-edit'
import { fetchSessionInfo } from '@/app/lib/data'
import { SessionInfo } from '@/app/lib/definitions'

export default function SessionForm({ id }: { id: number }): JSX.Element {
  //
  // State variable to hold session data
  //
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)
  const [bsdftmaxquestions, setbsdftmaxquestions] = useState<number>(0)
  const [bsskipcorrect, setbsskipcorrect] = useState<boolean>(false)
  const [bssortquestions, setbssortquestions] = useState<boolean>(false)
  //
  //  Fetch session data when the component mounts or when id changes
  //
  useEffect(() => {
    getsessionInfo(id)
  }, [id])
  //
  //  FormData state
  //
  const initialState = { message: null, errors: {} }
  const [formState, formAction] = useFormState(sessionUser, initialState)
  //-------------------------------------------------------------------------
  //  Get Data
  //-------------------------------------------------------------------------
  async function getsessionInfo(id: number) {
    try {
      const data = await fetchSessionInfo(id)
      if (data) {
        setSessionInfo(data)
        setbsdftmaxquestions(data.bsdftmaxquestions)
        setbsskipcorrect(data.bsskipcorrect)
        setbssortquestions(data.bssortquestions)
      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error)
    }
  }
  //-------------------------------------------------------------------------
  //  Update
  //-------------------------------------------------------------------------
  function UpdateButton() {
    const { pending } = useFormStatus()
    return (
      <Button className='mt-4 w-72 md:max-w-md px-4' aria-disabled={pending}>
        Update
      </Button>
    )
  }
  //-------------------------------------------------------------------------
  return (
    <form action={formAction} className='space-y-3 '>
      <div className='flex-1 rounded-lg bg-gray-50 px-4 pb-2 pt-2 max-w-md'>
        <div className=''>
          {/*  ...................................................................................*/}
          {/*  SESSION INFO  */}
          {/*  ...................................................................................*/}
          {/*  Mobile  */}
          <div className=' md:hidden'>
            <div className='block text-xs font-medium text-gray-900'>
              <h1>{`Session: ${sessionInfo?.bsid}`}</h1>
              <h1>{`User: ${sessionInfo?.bsuid} ${sessionInfo?.bsname} `}</h1>
            </div>
          </div>
          {/*  ...................................................................................*/}
          {/*  MAX QUESTIONS  */}
          {/*  ...................................................................................*/}
          <div className='mt-4'>
            <label
              className='mb-3 mt-5 block text-xs font-medium text-gray-900'
              htmlFor='bsdftmaxquestions'
            >
              Maximum Number of Questions
            </label>
            <div className='relative'>
              <input
                className='w-72 md:max-w-md px-4 rounded-md border border-blue-500 py-[9px] text-sm '
                id='bsdftmaxquestions'
                type='number'
                name='bsdftmaxquestions'
                autoComplete='bsdftmaxquestions'
                required
                value={bsdftmaxquestions}
                onChange={e => setbsdftmaxquestions(Number(e.target.value))}
              />
            </div>
          </div>
          <div id='bsdftmaxquestions-error' aria-live='polite' aria-atomic='true'>
            {formState.errors?.bsdftmaxquestions &&
              formState.errors.bsdftmaxquestions.map((error: string) => (
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
              id='bsskipcorrect'
              className='sr-only peer'
              name='bsskipcorrect'
              checked={bsskipcorrect}
              onChange={() => setbsskipcorrect(prev => !prev)}
              value={bsskipcorrect ? 'true' : 'false'}
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
              id='bssortquestions'
              className='sr-only peer'
              name='bssortquestions'
              checked={bssortquestions}
              onChange={() => setbssortquestions(prev => !prev)}
              value={bssortquestions ? 'true' : 'false'}
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
    </form>
  )
}

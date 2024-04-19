'use client'

import { Button } from '@/app/ui/button'

export function QuizSubmit() {
  return (
    <>
      <Button
        className='px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        onClick={() => console.log('submit button pressed')}
      >
        Submit Selection
      </Button>
    </>
  )
}

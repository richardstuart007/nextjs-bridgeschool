'use client'

import { QuestionsTable } from '@/app/lib/definitions'

export default function QuestionsForm({ questions }: { questions: QuestionsTable }) {
  return (
    <form>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        <p>id {questions.qqid}</p>
      </div>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        <p>owner {questions.qowner}</p>
      </div>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        <p>group {questions.qgroup}</p>
      </div>
    </form>
  )
}

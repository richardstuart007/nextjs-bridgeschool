import { QuestionsTable } from '@/app/lib/definitions'

export default function QuestionsForm({ questions }: { questions: QuestionsTable[] }) {
  const question1 = questions[0]
  return (
    <form>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        <p>id: {question1.qqid}</p>
      </div>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        <p>owner: {question1.qowner}</p>
      </div>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        <p>group: {question1.qgroup}</p>
      </div>
    </form>
  )
}

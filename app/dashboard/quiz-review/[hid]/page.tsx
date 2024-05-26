import ReviewForm from '@/app/ui/quiz-review/form'
import Breadcrumbs from '@/app/ui/utils/breadcrumbs'
import { fetchQuestionsByGid, fetchHistoryById } from '@/app/lib/data'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { QuestionsTable, UsershistoryTable } from '@/app/lib/definitions'

export const metadata: Metadata = {
  title: 'Quiz Review'
}

export default async function Page({ params }: { params: { hid: number } }) {
  //
  //  Variables used in the return statement
  //
  const hid: number = params.hid
  try {
    //
    //  Get History
    //
    const history: UsershistoryTable = await fetchHistoryById(hid)
    if (!history) {
      notFound()
    }
    //
    //  Get Questions
    //
    const qgid = history.r_gid
    const questions: QuestionsTable[] = await fetchQuestionsByGid(qgid)
    if (!questions || questions.length === 0) {
      notFound()
    }

    return (
      <div className='w-full md:p-6'>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'History', href: '/dashboard/history' },
            {
              label: 'Quiz-Review',
              href: `/dashboard/quiz-review/${hid}`,
              active: true
            }
          ]}
        />
        <ReviewForm history={history} questions={questions} />
      </div>
    )
  } catch (error) {
    console.error('An error occurred while fetching history data:', error)
    return <div>An error occurred while fetching history data.</div>
  }
}

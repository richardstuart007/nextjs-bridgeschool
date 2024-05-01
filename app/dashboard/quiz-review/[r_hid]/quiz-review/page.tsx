import Form from '@/app/ui/quiz-review/quiz-review-form'
import Breadcrumbs from '@/app/ui/breadcrumbs'
import { fetchQuestionsByGid, fetchHistoryById } from '@/app/lib/data'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { QuestionsTable, UsershistoryTable } from '@/app/lib/definitions'

export const metadata: Metadata = {
  title: 'Quiz Review'
}

export default async function Page({ params }: { params: { r_hid: number } }) {
  //
  //  Variables used in the return statement
  //
  const r_hid: number = params.r_hid

  try {
    //
    //  Get History
    //
    const history: UsershistoryTable = await fetchHistoryById(r_hid)
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
      <>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Library', href: '/dashboard/library' },
            {
              label: 'Quiz-Review',
              href: `/dashboard/quiz-review/${r_hid}/quiz-review`,
              active: true
            }
          ]}
        />
        <Form history={history} questions={questions} />
      </>
    )
  } catch (error) {
    console.error('An error occurred while fetching data:', error)
    return <div>An error occurred while fetching data.</div>
  }
}

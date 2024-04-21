import Form from '@/app/ui/quiz-review/quiz-review-form'
import Breadcrumbs from '@/app/ui/breadcrumbs'
import { fetchQuestionsByGid } from '@/app/lib/data'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { QuestionsTable } from '@/app/lib/definitions'

export const metadata: Metadata = {
  title: 'Quiz Review'
}

export default async function Page({ params }: { params: { gid: number } }) {
  //
  //  Variables used in the return statement
  //
  let gid: number = params.gid
  let questions: QuestionsTable[] = []

  try {
    //
    //  Get Questions
    //
    const [questionsData] = await Promise.all([fetchQuestionsByGid(gid)])
    if (!questionsData) {
      notFound()
    }
    questions = questionsData
  } catch (error) {
    console.error('An error occurred while fetching data:', error)
  }
  try {
    return (
      <>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Library', href: '/dashboard/library' },
            {
              label: 'Quiz-Review',
              href: `/dashboard/quiz-review/${gid}/quiz-review`,
              active: true
            }
          ]}
        />
        <Form questions={questions} />
      </>
    )
  } catch (error) {
    console.error('An error occurred while rendering:', error)
  }
}

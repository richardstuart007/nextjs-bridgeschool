import Form from '@/app/ui/library/quiz-form'
import Breadcrumbs from '@/app/ui/library/breadcrumbs'
import { fetchLibraryById, fetchQuestionsByOwnerGroup } from '@/app/lib/data'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiz'
}

export default async function Page({ params }: { params: { lrlid: number } }) {
  //
  //  Get library element
  //
  const lrlid = params.lrlid
  const [library] = await Promise.all([fetchLibraryById(lrlid)])
  if (!library) {
    notFound()
  }
  //
  //  Get Questions
  //
  const lrowner = library.lrowner
  const lrgroup = library.lrgroup
  const [questions] = await Promise.all([fetchQuestionsByOwnerGroup(lrowner, lrgroup)])
  if (!questions) {
    notFound()
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Library', href: '/dashboard/library' },
          {
            label: 'Quiz',
            href: `/dashboard/library/${lrlid}/quiz`,
            active: true
          }
        ]}
      />
      <Form questions={questions} />
    </main>
  )
}

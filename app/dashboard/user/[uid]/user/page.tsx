import Form from '@/app/ui/user/form'
import Breadcrumbs from '@/app/ui/utils/breadcrumbs'
import { fetchUserById } from '@/app/lib/data'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { UsersTable } from '@/app/lib/definitions'

export const metadata: Metadata = {
  title: 'User'
}
export default async function Page({ params }: { params: { uid: number } }) {
  //
  //  Variables used in the return statement
  //
  let uid: number = params.uid
  let UserRecord: UsersTable | null = null

  try {
    //
    //  Get User
    //
    const data = await fetchUserById(uid)
    if (!data) notFound()
    UserRecord = data
  } catch (error) {
    console.error('An error occurred while fetching data:', error)
  }
  //---------------------------------------------------
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          {
            label: 'User',
            href: `/dashboard/user/${uid}/user`,
            active: true
          }
        ]}
      />
      {UserRecord ? <Form UserRecord={UserRecord} /> : null}
    </>
  )
}

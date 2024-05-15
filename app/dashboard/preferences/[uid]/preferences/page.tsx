import PreferencesForm from '@/app/ui/preferences/form'
import Breadcrumbs from '@/app/ui/breadcrumbs'
import { fetchUserById } from '@/app/lib/data'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { UsersTable } from '@/app/lib/definitions'

export const metadata: Metadata = {
  title: 'User Preferences'
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
          { label: 'Library', href: '/dashboard/library' },
          {
            label: 'Preferences',
            href: `/dashboard/preferences/${uid}/preferences`,
            active: true
          }
        ]}
      />
      {UserRecord ? <PreferencesForm UserRecord={UserRecord} /> : null}
    </>
  )
}

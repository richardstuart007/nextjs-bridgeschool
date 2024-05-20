import SessionForm from '@/app/ui/session/form'
import Breadcrumbs from '@/app/ui/utils/breadcrumbs'
import { Metadata } from 'next'
import { getCookie } from '@/app/lib/actions'

export const metadata: Metadata = {
  title: 'Session Preferences'
}

export default async function Page(): Promise<JSX.Element> {
  const sessionData = await getCookie()
  //---------------------------------------------------
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          {
            label: 'Session',
            href: `/dashboard/session`,
            active: true
          }
        ]}
      />
      {sessionData ? <SessionForm BSsession={sessionData} /> : null}
    </>
  )
}

import SessionForm from '@/app/ui/session/form'
import Breadcrumbs from '@/app/ui/utils/breadcrumbs'
import { Metadata } from 'next'
import { getCookie } from '@/app/lib/actions'

export const metadata: Metadata = {
  title: 'Session'
}
export default async function Page() {
  const BSsession = await getCookie()
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
      {BSsession ? <SessionForm BSsession={BSsession} /> : null}
    </>
  )
}

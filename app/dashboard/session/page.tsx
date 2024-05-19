import SessionForm from '@/app/ui/session/form'
import Breadcrumbs from '@/app/ui/utils/breadcrumbs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Session'
}
export default async function Page() {
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
      <SessionForm />
    </>
  )
}

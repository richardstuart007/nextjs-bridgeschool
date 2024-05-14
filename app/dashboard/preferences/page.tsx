import PreferencesForm from '@/app/ui/preferences/form'
import { lusitana } from '@/app/ui/fonts'
import { fetchUserById } from '@/app/lib/data'
import { Metadata } from 'next'
import { getCookieInfo } from '@/app/lib/actions'

export const metadata: Metadata = {
  title: 'User Preferences'
}

export default async function Page() {
  //
  //  Get User Cookie - usid
  //
  const UserCookie = await getCookieInfo('BS_session')
  if (!UserCookie) return <div>Not logged in</div>
  const uid = UserCookie.u_uid
  //
  //  Get the User Record
  //
  const UserRecord = await fetchUserById(uid)
  if (!UserRecord) return <div>User not found</div>
  //
  //  Process the form with the user record
  //
  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <h1 className={`${lusitana.className} text-2xl`}>Preferences</h1>
      </div>
      <PreferencesForm UserRecord={UserRecord} />
    </div>
  )
}

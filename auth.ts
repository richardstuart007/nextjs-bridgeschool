import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import type { UserAuth, UsersTable, NewUserssessionsTable } from '@/app/lib/definitions'
import bcrypt from 'bcrypt'
import { writeUserssessions } from '@/app/lib/actions'
import { writeCookieBSsession } from '@/app/lib/actions'
import { fetchUserByEmail } from '@/app/lib/data'
// ----------------------------------------------------------------------
//  Check User/Password
// ----------------------------------------------------------------------
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        //
        //  Validate input format
        //
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials)
        if (!parsedCredentials.success) return null
        //
        //  Get user from database
        //
        const { email, password } = parsedCredentials.data
        const userRecord = await fetchUserByEmail(email)
        if (!userRecord) {
          // console.log('Invalid credentials - User')
          return null
        }
        //
        //  Check password
        //
        const passwordsMatch = await bcrypt.compare(password, userRecord.u_hash)
        if (!passwordsMatch) {
          // console.log('Invalid credentials - password')
          return null
        }
        //
        // Write session information
        //
        const usersessionsRecord = await writeSession(userRecord)
        const usid = usersessionsRecord.usid
        // console.log('auth: usid', usid)
        //
        // Write cookie
        //
        await writeCookieBSsession(userRecord, usid)
        // console.log('auth: cookie written')
        //
        //  Return in correct format
        //
        return {
          id: userRecord.u_uid.toString(),
          name: userRecord.u_name,
          email: userRecord.u_email,
          password: userRecord.u_hash
        } as UserAuth
      }
    })
  ]
})
// ----------------------------------------------------------------------
//  Write session information
// ----------------------------------------------------------------------
async function writeSession(userRecord: UsersTable) {
  try {
    //
    //  Destructure user record
    //
    const { u_uid, u_user } = userRecord
    //
    //  Create session record
    //
    const userssession: NewUserssessionsTable = {
      usdatetime: new Date().toISOString().replace('T', ' ').replace('Z', '').substring(0, 23),
      usuid: u_uid,
      ususer: u_user
    }
    const usersessionsRecord = await writeUserssessions(userssession)
    //
    //  Return uer record
    //
    return usersessionsRecord
  } catch (error) {
    throw new Error('Failed to write session info.')
  }
}

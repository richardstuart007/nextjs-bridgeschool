import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import type { UserAuth, UsersTable, NewSessionsTable } from '@/app/lib/definitions'
import bcrypt from 'bcrypt'
import { writeSessions, updateCookieSessionId, fetchUserByEmail } from '@/app/lib/data'
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
        //
        //  Fail credentials then return
        //
        if (!parsedCredentials.success) return null
        //
        //  Get user from database
        //
        const { email, password } = parsedCredentials.data
        const userRecord = await fetchUserByEmail(email)
        if (!userRecord) return null
        //
        //  Check password
        //
        const passwordsMatch = await bcrypt.compare(password, userRecord.u_hash)
        if (!passwordsMatch) return null
        //
        // Write session information
        //
        const sessionsRecord = await writeSession(userRecord)
        //
        // Write cookie session
        //
        await updateCookieSessionId(sessionsRecord.s_id)
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
    const { u_uid } = userRecord
    //
    //  Create session record
    //
    const session: NewSessionsTable = {
      s_datetime: new Date().toISOString().replace('T', ' ').replace('Z', '').substring(0, 23),
      s_uid: u_uid
    }
    const sessionsRecord = await writeSessions(session)
    //
    //  Return uer record
    //
    return sessionsRecord
  } catch (error) {
    throw new Error('Failed to write session info.')
  }
}

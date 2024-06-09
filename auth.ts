import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import type {
  UserAuth,
  UsersTable,
  NewUserssessionsTable,
  NewSessionsTable
} from '@/app/lib/definitions'
import bcrypt from 'bcrypt'
import {
  writeUserssessions,
  writeSessions,
  updateCookieBS_session,
  updateCookieSession,
  fetchUserByEmail
} from '@/app/lib/data'

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
        if (!userRecord) return null
        //
        //  Check password
        //
        const passwordsMatch = await bcrypt.compare(password, userRecord.u_hash)
        if (!passwordsMatch) return null
        //
        // Write user session information
        //
        const userssessionsRecord = await writeUserssession(userRecord)
        //
        // Write cookie BS_session
        //
        const BS_session = {
          bsuid: userRecord.u_uid,
          bsname: userRecord.u_name,
          bsemail: userRecord.u_email,
          bsid: userssessionsRecord.usid,
          bssignedin: true,
          bssortquestions: true,
          bsskipcorrect: true,
          bsdftmaxquestions: 20
        }
        await updateCookieBS_session(BS_session)
        //
        // Write session information
        //
        const sessionsRecord = await writeSession(userRecord)
        //
        // Write cookie session
        //
        await updateCookieSession(sessionsRecord.s_id)
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
//  Write user session information
// ----------------------------------------------------------------------
async function writeUserssession(userRecord: UsersTable) {
  try {
    //
    //  Destructure user record
    //
    const { u_uid } = userRecord
    //
    //  Create session record
    //
    const userssession: NewUserssessionsTable = {
      usdatetime: new Date().toISOString().replace('T', ' ').replace('Z', '').substring(0, 23),
      usuid: u_uid
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

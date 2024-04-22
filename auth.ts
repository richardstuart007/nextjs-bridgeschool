import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import type { UserAuth, Userrecord, NewUserssessionsTable } from '@/app/lib/definitions'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { writeUserssessions } from '@/app/lib/actions'
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
          console.log('Invalid credentials - User')
          return null
        }
        //
        //  Check password
        //
        const passwordsMatch = await bcrypt.compare(password, userRecord.u_hash)
        if (!passwordsMatch) {
          console.log('Invalid credentials - password')
          return null
        }
        //
        // Write session information
        //
        const usersessionsRecord = await writeSession(userRecord)
        const usid = usersessionsRecord.usid
        //
        // Write cookie
        //
        const { u_uid, u_user, u_name, u_email } = userRecord
        writeCookie(u_uid, u_user, u_name, u_email, usid)
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
async function writeSession(userRecord: Userrecord) {
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
    console.log('AUTH: usersessionsRecord:', usersessionsRecord)
    //
    //  Return uer record
    //
    return usersessionsRecord
  } catch (error) {
    throw new Error('Failed to write session info.')
  }
}
// ----------------------------------------------------------------------
//  Write Cookie information
// ----------------------------------------------------------------------
function writeCookie(
  u_uid: number,
  u_user: string,
  u_name: string,
  u_email: string,
  usid: number
): void {
  try {
    //
    //  Create session cookie
    //
    const newUserRecord = { usid, u_uid, u_user, u_name, u_email }
    const JSONnewUserRecord = JSON.stringify(newUserRecord)
    console.log('AUTH: JSONnewUserRecord:', JSONnewUserRecord)
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    cookies().set('BridgeSchool_Session', JSONnewUserRecord, {
      httpOnly: false,
      secure: false,
      expires: expires,
      sameSite: 'lax',
      path: '/'
    })
    //
    //  Check cookie
    //
    const checkCookie = cookies().get('BridgeSchool_Session')
    console.log('AUTH: checkCookie:', checkCookie)
    let r_uid = 0
    const BridgeSchool_Session = cookies().get('BridgeSchool_Session')
    if (BridgeSchool_Session) {
      const decodedCookie = decodeURIComponent(BridgeSchool_Session.value)
      const JSON_BridgeSchool_Session = JSON.parse(decodedCookie)
      if (JSON_BridgeSchool_Session && JSON_BridgeSchool_Session.u_uid) {
        console.log('AUTH: JSON_BridgeSchool_Session:', JSON_BridgeSchool_Session)
        r_uid = JSON_BridgeSchool_Session.u_uid
      }
    }
    console.log('AUTH: r_uid:', r_uid)
  } catch (error) {
    throw new Error('Failed to write cookie info.')
  }
}

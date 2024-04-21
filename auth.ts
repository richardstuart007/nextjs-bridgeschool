import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import { sql } from '@vercel/postgres'
import type { User, Userrecord } from '@/app/lib/definitions'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
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
        const userRecord = await getUser(email)
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
        //  User Authenticated - create session cookie
        //
        // const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        const { u_uid, u_user, u_name, u_email } = userRecord
        const newUserRecord = { u_uid, u_user, u_name, u_email }
        const JSONnewUserRecord = JSON.stringify(newUserRecord)
        console.log('JSONnewUserRecord:', JSONnewUserRecord)
        cookies().set('BridgeSchool_Session', JSONnewUserRecord, {
          httpOnly: false,
          secure: true,
          // expires: expires,
          sameSite: 'lax',
          path: '/'
        })
        //
        //  Return in correct format
        //
        return {
          id: userRecord.u_uid.toString(),
          name: userRecord.u_name,
          email: userRecord.u_email,
          password: userRecord.u_hash
        } as User
      }
    })
  ]
})
// ----------------------------------------------------------------------
//  Get user by email
// ----------------------------------------------------------------------
async function getUser(email: string): Promise<Userrecord | undefined> {
  try {
    const userrecord = await sql<Userrecord>`SELECT * FROM users WHERE u_email=${email}`
    //
    //  Not found
    //
    if (userrecord.rowCount === 0) {
      return undefined
    }
    //
    //  Return data
    //
    const user = userrecord.rows[0]
    return user
  } catch (error) {
    throw new Error('Failed to fetch user.')
  }
}

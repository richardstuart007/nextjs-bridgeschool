import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import { sql } from '@vercel/postgres'
import type { User, Userrecord } from '@/app/lib/definitions'
import bcrypt from 'bcrypt'
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
        const user = await getUser(email)
        if (!user) {
          console.log('Invalid credentials - User')
          return null
        }
        //
        //  Check password
        //
        const passwordsMatch = await bcrypt.compare(password, user.password)
        if (!passwordsMatch) {
          console.log('Invalid credentials - password')
          return null
        }
        //
        //  OK
        //
        return user
      }
    })
  ]
})
// ----------------------------------------------------------------------
//  Get user by email
// ----------------------------------------------------------------------
async function getUser(email: string): Promise<User | undefined> {
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
    const data = userrecord.rows[0]
    return {
      id: data.u_uid.toString(),
      name: data.u_name,
      email: data.u_email,
      password: data.u_hash
    }
  } catch (error) {
    throw new Error('Failed to fetch user.')
  }
}

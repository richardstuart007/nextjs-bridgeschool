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
    const sqlstatement = `SELECT * FROM users WHERE u_email=${email}`
    console.log('sqlstatement:', sqlstatement)
    const userrecord = await sql<Userrecord>`SELECT * FROM users WHERE u_email=${email}`
    const r = userrecord.rows[0]
    return {
      id: r.u_uid.toString(),
      name: r.u_name,
      email: r.u_email,
      password: r.u_hash
    }
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}

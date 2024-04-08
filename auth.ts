import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import { sql } from '@vercel/postgres'
import type { User } from '@/app/lib/definitions'
import bcrypt from 'bcrypt'
// ----------------------------------------------------------------------
//  Check User & Password
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
        const passwordsMatch = await bcrypt.compare(password, user.u_hash)
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
    const user = await sql<User>`SELECT * FROM users WHERE u_email=${email}`
    return user.rows[0]
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}

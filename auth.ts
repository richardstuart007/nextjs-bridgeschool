import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import type { UserAuth, ProviderSignInParams } from '@/app/lib/definitions'
import bcrypt from 'bcryptjs'
import { fetchUserByEmail, fetchUserPwdByEmail, providerSignIn } from '@/app/lib/data'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
// ----------------------------------------------------------------------
//  Check User/Password
// ----------------------------------------------------------------------
let sessionId = 0
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  trustHost: true,
  callbacks: {
    async signIn({ user, account }) {
      const { email, name } = user
      const provider = account?.provider
      //
      //  Errors
      //
      if (!provider || !email || !name) return false
      //
      //  Write session information & cookie
      //
      const signInData: ProviderSignInParams = {
        provider: provider,
        email: email,
        name: name
      }
      sessionId = await providerSignIn(signInData)
      return true
    },
    //
    //  Update the session information from the Token
    //
    async session({ token, session }) {
      if (token.sub && session.user) session.user.id = token.sub
      if (token.sessionId && session.user) session.user.sessionId = token.sessionId as string
      return session
    },
    //
    //  update token sessionId to latest
    //
    async jwt({ token }) {
      if (!token.sub) return token
      let tokenSessionId = 0
      if (typeof token.sessionId === 'number') tokenSessionId = token.sessionId
      if (sessionId > tokenSessionId) token.sessionId = sessionId
      return token
    }
  },
  ...authConfig,
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
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
        //  Get userpwd from database
        //
        const { email, password } = parsedCredentials.data
        const userPwd = await fetchUserPwdByEmail(email)
        if (!userPwd) return null
        //
        //  Check password if exists
        //
        const passwordsMatch = await bcrypt.compare(password, userPwd.uphash)
        if (!passwordsMatch) return null
        //
        //  Get User record
        //
        const userRecord = await fetchUserByEmail(email)
        if (!userRecord) return null
        //
        //  Return in correct format
        //
        return {
          id: userRecord.u_uid.toString(),
          name: userRecord.u_name,
          email: userRecord.u_email,
          password: userPwd.uphash
        } as UserAuth
      }
    })
  ]
})

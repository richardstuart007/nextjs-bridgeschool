import type { NextAuthConfig } from 'next-auth'
import { cookies } from 'next/headers'

export const authConfig = {
  pages: {
    signIn: '/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      //
      //  Get status
      //
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnLogin = nextUrl.pathname.startsWith('/login')
      //
      //  Login status (Auth not working yet)
      //
      let isLoggedIn = false
      let sessionId: string | null = null
      const cookie = cookies().get('BS_session')
      if (cookie) {
        isLoggedIn = true
        const BS_session = JSON.parse(cookie.value)
        sessionId = BS_session.bsid.toString()
      }
      //
      //  If not on login and not on dashboard then OK
      //
      if (!isOnLogin && !isOnDashboard) return true
      //
      //  Dashboard and Logged in - true
      //
      if (isOnDashboard) {
        if (isLoggedIn) return true
        //
        //  Dashboard and NOT Logged in - redirect to login
        //
        return Response.redirect(new URL('/login', nextUrl.origin).href)
        //
        //  NOT Dashboard and Logged in - redirect to dashboard
        //
      } else if (isLoggedIn) {
        const URLstring = `/dashboard?sessionId=${sessionId}`
        return Response.redirect(new URL(URLstring, nextUrl.origin).href)
      }
      //
      // Allow access for other pages
      //
      return true
    }
  },
  providers: []
} satisfies NextAuthConfig

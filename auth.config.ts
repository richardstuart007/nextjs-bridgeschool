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
      let isLoggedIn
      const cookie = cookies().get('BS_session')
      cookie ? (isLoggedIn = true) : (isLoggedIn = false)
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
        return Response.redirect(new URL('/dashboard', nextUrl.origin).href)
      }
      //
      // Allow access for other pages
      //
      return true
    }
  },
  providers: []
} satisfies NextAuthConfig

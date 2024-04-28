import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      //
      //  Get status
      //
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      // const isOnLogin = nextUrl.pathname.startsWith('/login')
      // console.log('auth:', auth)
      // console.log('nextUrl:', nextUrl)
      // console.log('isLoggedIn:', isLoggedIn)
      // console.log('isOnDashboard:', isOnDashboard)
      // console.log('isOnLogin:', isOnLogin)
      //
      //  Dashboard and Logged in - true
      //
      if (isOnDashboard) {
        if (isLoggedIn) return true
        //
        //  Dashboard and NOT Logged in - redirect to login
        //
        console.log('REDIRECTING to login')
        return Response.redirect(new URL('/login', nextUrl.origin).href)
        //
        //  NOT Dashboard and Logged in - redirect to dashboard
        //
      } else if (isLoggedIn) {
        console.log('REDIRECTING to dashboard')
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

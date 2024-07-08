import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
  adminRoutePrefix
} from '@/routes'
import { cookies } from 'next/headers'

const { auth } = NextAuth(authConfig)

export default auth((req: any): any => {
  const { nextUrl } = req
  const pathname = nextUrl.pathname
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(pathname)
  const isAuthRoute = authRoutes.includes(pathname)
  const isAdminRoute = pathname.startsWith(adminRoutePrefix)
  //
  //  Login status (Auth not working yet)
  //
  const cookie = cookies().get('SessionId')
  const isLoggedInCookie = !!cookie
  // console.log('isLoggedInCookie:', isLoggedInCookie)
  // console.log('pathname:', pathname)
  // console.log('isApiAuthRoute:', isApiAuthRoute)
  // console.log('isPublicRoute:', isPublicRoute)
  // console.log('isAuthRoute:', isAuthRoute)
  // console.log('isAdminRoute:', isAdminRoute)
  //
  //  Allow all API routes
  //
  if (isApiAuthRoute) {
    return null
  }
  //
  //  Allow public route
  //
  if (isPublicRoute) {
    return null
  }
  //
  //  Allow Admin route ????????????
  //
  if (isAdminRoute) {
    return null
  }
  //
  //  Authorised Route
  //
  if (isAuthRoute) {
    if (isLoggedInCookie) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null
  }
  //
  //  Not logged in go to login
  //
  if (!isLoggedInCookie) {
    return Response.redirect(new URL('/login', nextUrl))
  }
  //
  //  Allow others
  //
  return null
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}

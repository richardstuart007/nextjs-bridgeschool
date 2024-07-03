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
  let isLoggedIn = !!req.auth
  const { nextUrl } = req
  const pathname = nextUrl.pathname
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(pathname)
  const isAuthRoute = authRoutes.includes(pathname)
  const isAdminRoute = pathname.startsWith(adminRoutePrefix)
  //
  //  Allow all API routes
  //
  if (isApiAuthRoute) {
    return null
  }
  //
  //  Allow Admin route ????????????
  //
  if (isAdminRoute) {
    return null
  }
  //
  //  Login status (Auth not working yet)
  //
  let sessionId: string | null = null
  const cookie = cookies().get('SessionId')
  let isLoggedInCookie = false
  if (cookie) {
    isLoggedInCookie = true
    sessionId = JSON.parse(cookie.value).toString()
  }
  //
  //  Login is true but SessionId cookie missing - therefore effectively logged out
  //
  if (isLoggedIn && !isLoggedInCookie) {
    isLoggedIn = false
    console.log('Middleware: isLoggedIn CHANGED ', isLoggedIn)
  }
  //
  //  Authorised Route
  //
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null
  }
  //
  //  Not logged in & not a public route, go to login
  //
  if (!isLoggedIn && !isPublicRoute) {
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

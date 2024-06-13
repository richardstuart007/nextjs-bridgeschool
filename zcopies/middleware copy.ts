import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from '@/routes'

const { auth } = NextAuth(authConfig)

export default auth(req => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  console.log('ROUTE: ', nextUrl.pathname)
  console.log('IS LOGGEDIN: ', isLoggedIn)
  console.log('isApiAuthRoute: ', isApiAuthRoute)
  console.log('isPublicRoute: ', isPublicRoute)
  console.log('isAuthRoute: ', isAuthRoute)
  //
  //  Allow all API routes
  //
  if (isApiAuthRoute) return null
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

import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { cookies } from 'next/headers'

const { auth } = NextAuth(authConfig)

export default auth(req => {
  // console.log('Middleware ------------------------------------------')
  let isLoggedIn = !!req.auth
  const { nextUrl } = req
  const pathname = nextUrl.pathname
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(pathname)
  const isAuthRoute = authRoutes.includes(pathname)
  // console.log('Middleware: pathname: ', pathname)
  // console.log('Middleware: isLoggedIn: ', isLoggedIn)
  // console.log('Middleware: isPublicRoute: ', isPublicRoute)
  // console.log('Middleware: isAuthRoute: ', isAuthRoute)
  //
  //  Allow all API routes
  //
  if (isApiAuthRoute) {
    // console.log('Middleware: isApiAuthRoute: ', isApiAuthRoute)
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
  // console.log('Middleware: isLoggedInCookie: ', isLoggedInCookie)
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
      const URLstring = `${DEFAULT_LOGIN_REDIRECT}?sessionId=${sessionId}`
      // console.log('Middleware: REDIRECT URLstring: ', URLstring)
      return Response.redirect(new URL(URLstring, nextUrl))
    }
    // console.log('Middleware: OK')
    return null
  }
  //
  //  Not logged in & not a public route, go to login
  //
  if (!isLoggedIn && !isPublicRoute) {
    // console.log('Middleware: REDIRECT /login ')
    return Response.redirect(new URL('/login', nextUrl))
  }
  //
  //  Allow others
  //
  // console.log('Middleware: OK default')
  return null
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}

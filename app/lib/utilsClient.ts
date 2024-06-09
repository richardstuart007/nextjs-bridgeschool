'use client'
import { BS_session } from './definitions'

// ----------------------------------------------------------------------
//  Get cookie information from the client
// ----------------------------------------------------------------------
export function getCookieClient(): BS_session | null {
  const cookieName = 'BS_session'
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${cookieName}=`)
  if (parts.length === 2) {
    const lastPart = parts.pop()
    if (lastPart) {
      const splitParts = lastPart.split(';')
      const firstPart = splitParts.shift()
      if (firstPart) {
        const decodedCookie = decodeURIComponent(firstPart)
        //
        // Assuming your cookie data is in JSON format
        //
        try {
          const parsedCookie = JSON.parse(decodedCookie)
          return parsedCookie as BS_session
        } catch (error) {
          console.error('Error parsing cookie:', error)
          return null
        }
      }
    }
  }
  return null
}
// // ----------------------------------------------------------------------
// //  GET User Session to Session Storage
// // ----------------------------------------------------------------------
// export function getSession_BS_session(): BS_session | null {
//   //
//   //  Get the session info
//   //
//   const dataString = sessionStorage.getItem('BS_session')
//   //
//   //  No data
//   //
//   if (!dataString) return null
//   //
//   //  Parse the data & return
//   //
//   try {
//     const data: BS_session = JSON.parse(dataString)
//     return data
//   } catch (error) {
//     console.error('Error parsing session data:', error)
//     return null
//   }
// }

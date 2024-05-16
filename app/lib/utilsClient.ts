'use client'
import { BSsessionTable } from './definitions'
// ----------------------------------------------------------------------
//  Write User Session to Session Storage from the cookie
// ----------------------------------------------------------------------
// export function writeSession_BS_session() {
//   //
//   //  If already written return
//   //
//   const BS_session = getSession_BS_session()
//   if (BS_session) return BS_session
//   //
//   //  Get cookie
//   //
//   const data: BSsessionTable | null | undefined = getCookieClient()
//   if (!data) return null
//   //
//   //  Write info to storage
//   //
//   const JSONdata = JSON.stringify(data)
//   sessionStorage.setItem('BS_session', JSONdata)
//   return data
// }
// ----------------------------------------------------------------------
//  Get cookie information from the client
// ----------------------------------------------------------------------
export function getCookieClient(): BSsessionTable | null {
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
          return parsedCookie as BSsessionTable
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
// export function getSession_BS_session(): BSsessionTable | null {
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
//     const data: BSsessionTable = JSON.parse(dataString)
//     return data
//   } catch (error) {
//     console.error('Error parsing session data:', error)
//     return null
//   }
// }

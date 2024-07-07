'use client'
import { SessionInfo } from './definitions'

// ----------------------------------------------------------------------
//  Get cookie information from the client
// ----------------------------------------------------------------------
export function getCookieClient(): SessionInfo | null {
  const cookieName = 'SessionInfo'
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
          return parsedCookie as SessionInfo
        } catch (error) {
          console.error('Error parsing cookie:', error)
          return null
        }
      }
    }
  }
  return null
}

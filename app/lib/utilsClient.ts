import { BSuserTable } from './definitions'
// ----------------------------------------------------------------------
//  Write User Session to Session Storage from the cookie
// ----------------------------------------------------------------------
export function writeSession_BSuser() {
  //
  //  If already written return
  //
  const BSuser = sessionStorage.getItem('BSuser')
  if (BSuser) return null
  //
  //  Get cookie
  //
  const data: BSuserTable | null | undefined = getCookieClient('BSuser')
  if (!data) return null
  //
  //  Write info to storage
  //
  const JSONdata = JSON.stringify(data)
  sessionStorage.setItem('BSuser', JSONdata)
}
// ----------------------------------------------------------------------
//  Get cookie information from the client
// ----------------------------------------------------------------------
export function getCookieClient(cookieName: string): BSuserTable | undefined {
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
          return parsedCookie as BSuserTable
        } catch (error) {
          console.error('Error parsing cookie:', error)
          return null
        }
      }
    }
  }
  return null
}
// ----------------------------------------------------------------------
//  GET User Session to Session Storage
// ----------------------------------------------------------------------
export function getSession_BSuser(): BSuserTable | null {
  //
  //  Get the session info
  //
  const dataString = sessionStorage.getItem('BSuser')
  //
  //  No data
  //
  if (!dataString) return null
  //
  //  Parse the data & return
  //
  try {
    const data: BSuserTable = JSON.parse(dataString)
    return data
  } catch (error) {
    console.error('Error parsing session data:', error)
    return null
  }
}

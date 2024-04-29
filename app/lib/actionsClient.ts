export function resetSession() {
  //
  //  Remove session storage
  //
  const storeName = 'BS_session'
  const data = sessionStorage.getItem(storeName)
  if (data) {
    sessionStorage.removeItem(storeName)
    // console.log('Session storage deleted')
  }
  //
  //  Remove cookies
  //
  document.cookie = `${storeName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  // console.log(`${storeName} Cookie deleted`)
}

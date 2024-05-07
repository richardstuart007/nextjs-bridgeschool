export function resetSession() {
  //
  //  Remove session storage
  //
  const storeName = 'BS_session'
  const data = sessionStorage.getItem(storeName)
  if (data) {
    sessionStorage.removeItem(storeName)
  }
  //
  //  Remove cookies
  //
  document.cookie = `${storeName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

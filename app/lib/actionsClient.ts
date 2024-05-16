export function resetSession() {
  const storeName = 'BS_session'
  //
  //  Remove cookies
  //
  document.cookie = `${storeName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

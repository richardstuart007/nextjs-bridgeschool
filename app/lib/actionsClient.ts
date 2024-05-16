export function resetSession() {
  const storeName = 'BS_session'
  //
  //  Remove session storage
  //
  // const data = sessionStorage.getItem(storeName)
  // if (data) {
  //   sessionStorage.removeItem(storeName)
  // }
  //
  //  Remove cookies
  //
  document.cookie = `${storeName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

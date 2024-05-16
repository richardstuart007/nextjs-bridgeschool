'use client'

import { createContext, useState, useContext, ReactNode } from 'react'
import { BSsessionTable } from '@/app/lib/definitions'
//
// Define the context type
//
type UserContextType = {
  session: BSsessionTable
  setSession: React.Dispatch<React.SetStateAction<BSsessionTable>>
}
const defaultSession: BSsessionTable = {
  bsuid: 0,
  bsname: '',
  bsemail: '',
  bsid: 0,
  bssignedin: false

  // Add other default values as necessary
}
//
// Create the context
//
const UserContext = createContext<UserContextType>({
  session: defaultSession,
  setSession: () => {}
})
//------------------------------------------------------------------------------
// Create the provider
//------------------------------------------------------------------------------
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  //
  //  Provided the user state and setter
  //
  const [session, setSession] = useState<BSsessionTable>(defaultSession)
  //
  //  Pass state to the context
  //
  return <UserContext.Provider value={{ session, setSession }}>{children}</UserContext.Provider>
}
//------------------------------------------------------------------------------
// Create a custom hook to use the context
//------------------------------------------------------------------------------
export const useUserContext = (): UserContextType => {
  //
  //  Get context
  //
  const context = useContext(UserContext)
  //
  //  If no context then error
  //
  if (!context) throw new Error('useUserContext must be used within a UserProvider')
  //
  //  Return context
  //
  return context
}

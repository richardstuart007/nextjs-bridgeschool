'use client'

import { createContext, useState, useContext, ReactNode } from 'react'
import { SessionInfo } from '@/app/lib/definitions'
//
// Define the context type
//
type UserContextType = {
  session: SessionInfo
  setSession: React.Dispatch<React.SetStateAction<SessionInfo>>
}
const defaultSession: SessionInfo = {
  bsuid: 0,
  bsname: '',
  bsemail: '',
  bsid: 0,
  bssignedin: false,
  bssortquestions: true,
  bsskipcorrect: true,
  bsdftmaxquestions: 20
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
  const [session, setSession] = useState<SessionInfo>(defaultSession)
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

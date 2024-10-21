'use client'

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react'

type DemoModeContext = {
  demoMode: boolean
  setDemoMode: Dispatch<SetStateAction<boolean>>
}

const DemoModeContext = createContext<DemoModeContext | null>(null)

export function useDemoModeContext() {
  const context = useContext(DemoModeContext)
  if (!context) {
    throw new Error('Demo Mode Context must be used inside a provider.')
  }
  return context
}

type DemoModeContextProviderProps = PropsWithChildren<{}>
export default function DemoModeProvider({
  children,
}: DemoModeContextProviderProps) {
  const [demoMode, setDemoMode] = useState(false)
  return (
    <DemoModeContext.Provider value={{ demoMode, setDemoMode }}>
      {children}
    </DemoModeContext.Provider>
  )
}

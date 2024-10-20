'use client'

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react'

import { Label } from './ui/label'
import { Switch } from './ui/switch'

type TestModeContext = {
  active: boolean
  setActive: Dispatch<SetStateAction<boolean>>
}

const TestModeContext = createContext<TestModeContext | null>(null)

export function useTestModeContext() {
  const context = useContext(TestModeContext)
  if (!context) {
    throw new Error('Test Mode Context must be used inside a provider.')
  }
  return context
}

type TestModeContextProviderProps = PropsWithChildren<{}>
export default function TestMode({ children }: TestModeContextProviderProps) {
  const [active, setActive] = useState(false)
  return (
    <TestModeContext.Provider value={{ active, setActive }}>
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border bg-background p-1.5 shadow-xl">
        <Label htmlFor="test-mode" className="ml-1">
          Test Mode
        </Label>
        <Switch id="test-mode" checked={active} onCheckedChange={setActive} />
      </div>
      {children}
    </TestModeContext.Provider>
  )
}

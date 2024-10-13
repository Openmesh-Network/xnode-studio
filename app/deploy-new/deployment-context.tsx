'use client'

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react'

import { type DeploymentConfiguration } from '@/types/dataProvider'

type DeploymentContext = {
  config: DeploymentConfiguration
  setConfig: Dispatch<SetStateAction<DeploymentConfiguration>>
}

const DeploymentContext = createContext<DeploymentContext | null>(null)

export function useDeploymentContext() {
  const context = useContext(DeploymentContext)
  if (!context) {
    throw new Error('Deployment Context must be used inside a provider.')
  }
  return context
}

type DeploymentContextProviderProps = PropsWithChildren<{
  initialData: Pick<
    DeploymentConfiguration,
    'name' | 'description' | 'services'
  >
}>
export function DeploymentContextProvider({
  children,
  initialData,
}: DeploymentContextProviderProps) {
  const [config, setConfig] = useState<DeploymentConfiguration>(initialData)

  return (
    <DeploymentContext.Provider value={{ config, setConfig }}>
      {children}
    </DeploymentContext.Provider>
  )
}

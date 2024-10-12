'use client'

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react'

import { DeploymentConfiguration } from '@/types/dataProvider'

export type DeploymentContext = {
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

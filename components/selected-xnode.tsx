'use client'

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react'

export type SelectedXnode =
  | {
      type: 'Unit'
      id: bigint
    }
  | {
      type: 'Custom'
      // add provider?
      id: string
    }

type SelectedXNodeContext = {
  selectedXNode: SelectedXnode | null
  selectXNode: Dispatch<SetStateAction<SelectedXnode | null>>
}

const SelectedXNodeContext = createContext<SelectedXNodeContext | null>(null)

export function useSelectedXNode() {
  const context = useContext(SelectedXNodeContext)
  if (!context) {
    throw new Error('Selected Xnode Context must be used inside a provider.')
  }
  return context
}

type SelectedXNodeProviderProps = PropsWithChildren<{}>
export default function SelectedXnodeProvider({
  children,
}: SelectedXNodeProviderProps) {
  const [selectedXNode, selectXNode] = useState<SelectedXnode | null>(null)
  return (
    <SelectedXNodeContext.Provider value={{ selectedXNode, selectXNode }}>
      {children}
    </SelectedXNodeContext.Provider>
  )
}

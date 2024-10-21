'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getWeb3Login } from '@/utils/auth'
import { MoveRight } from 'lucide-react'
import { useAccount } from 'wagmi'

import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useDemoModeContext } from '@/components/demo-mode'

export default function LoginProcess() {
  const { address, isConnected } = useAccount()

  const [user, , setUser] = useUser()
  const { toast } = useToast()
  const [creatingSession, setCreatingSession] = useState<boolean>()
  const { refresh } = useRouter()

  async function createSession() {
    if (!address) return

    toast({
      title: 'Session Request Created',
      description: 'Please sign the request in your wallet to confirm',
    })

    setCreatingSession(true)
    const res = await getWeb3Login(address).finally(() =>
      setCreatingSession(false)
    )
    if (res) {
      setUser(res)
    }
    refresh() //destroy routing cache
  }

  async function deleteSession() {
    setUser(null)
    refresh() //destroy routing cache
  }

  useEffect(() => {
    if (!user || address) {
      // Logged in and wallet connected, user doesnt return address, so we cannot check if they match...
      return
    }
    // if (!user?.web3Address) {
    //   // No session
    //   return
    // }

    // if (user.web3Address.toLowerCase() === address?.toLowerCase()) {
    //   // Session is equal to currently connected address
    //   return
    // }

    // We connected with a different address (or not connected), destroy session
    setUser(null)
    refresh() //destroy routing cache
  }, [address, user, setUser])

  const { demoMode, setDemoMode } = useDemoModeContext()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-12">
        <div
          className={cn(
            'grow rounded border p-6 transition-colors',
            isConnected && 'border-green-500/50 bg-green-500/5'
          )}
        >
          <h2 className="text-xl font-bold">Connect your Wallet</h2>
          <p className="text-sm text-muted-foreground">
            Login to Xnode Studio with your web3 wallet
          </p>
          <div className="mt-4">
            {!isConnected ? <w3m-connect-button /> : <w3m-account-button />}
          </div>
        </div>
        <div>
          <MoveRight
            className="size-8 text-muted-foreground"
            strokeWidth={1.5}
          />
        </div>
        <div
          className={cn(
            'grow rounded border p-6 transition-colors',
            user && 'border-green-500/50 bg-green-500/5'
          )}
        >
          <h2 className="text-xl font-bold">Create Login Session</h2>
          <p className="text-sm text-muted-foreground">
            Create a session to access your account
          </p>
          <div className="mt-4">
            {!user ? (
              <Button
                disabled={!isConnected || creatingSession}
                size="lg"
                className="min-w-56"
                onClick={() => createSession()}
              >
                Create Session
              </Button>
            ) : (
              <Button
                size="lg"
                className="min-w-56"
                onClick={() => deleteSession()}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
      <div>
        <div
          className={cn(
            'grow rounded border p-6 transition-colors',
            demoMode && 'border-green-500/50 bg-green-500/5'
          )}
        >
          <h2 className="text-xl font-bold">Demo Mode</h2>
          <p className="text-sm text-muted-foreground">
            Try out the Xnode Studio interface without making any API calls.
          </p>
          <div className="mt-4">
            {!demoMode ? (
              <Button
                disabled={!isConnected || creatingSession}
                size="lg"
                className="min-w-56"
                onClick={() => setDemoMode(true)}
              >
                Enter Demo Mode
              </Button>
            ) : (
              <Button
                size="lg"
                className="min-w-56"
                onClick={() => setDemoMode(false)}
              >
                Exit Demo Mode
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

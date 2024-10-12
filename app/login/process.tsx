'use client'

import { getWeb3Login } from '@/utils/auth'
import { MoveRight } from 'lucide-react'
import { useAccount } from 'wagmi'

import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/button'

export default function LoginProcess() {
  const { address, isConnected } = useAccount()

  const [user, , setUser] = useUser()

  return (
    <div className="flex items-center gap-12">
      <div
        className={cn(
          'grow rounded border p-6 transition-colors',
          isConnected && 'border-green-500/50 bg-green-500/5'
        )}
      >
        <h2 className="text-xl font-bold">Connect your Wallet</h2>
        <p className="text-sm text-muted-foreground">
          Login to OpenMesh Xnode with a wallet address
        </p>
        <div className="mt-4">
          {!isConnected ? <w3m-connect-button /> : <w3m-account-button />}
        </div>
      </div>
      <div>
        <MoveRight className="size-8 text-muted-foreground" strokeWidth={1.5} />
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
              disabled={!isConnected}
              size="lg"
              className="min-w-56"
              onClick={() => getWeb3Login(address)}
            >
              Create Session
            </Button>
          ) : (
            <Button
              size="lg"
              className="min-w-56"
              onClick={() => setUser(null)}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

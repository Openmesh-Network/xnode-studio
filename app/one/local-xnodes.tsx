'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDemoModeContext } from '@/components/demo-mode'

export default function LocalXnodes() {
  const { demoMode } = useDemoModeContext()
  const localXnodes = demoMode
    ? [
        {
          ipAddress: '127.0.0.1',
        },
      ]
    : []
  const [activateXnode, setActivateXnode] = useState<string | undefined>(
    undefined
  )
  const { push } = useRouter()

  return (
    <>
      <div className="flex flex-col gap-5">
        {localXnodes.map((xnode) => (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">
                Xnode Found: {xnode.ipAddress}
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2">
                  <Check className="size-5 text-green-600" />
                  <span>Integrity Verified!</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => setActivateXnode(xnode.ipAddress)}>
                Activate
              </Button>
            </CardFooter>
          </Card>
        ))}
        <div className="flex place-items-center gap-5">
          <div className="size-8 animate-spin rounded-full border-b-2 border-primary" />
          <span>Searching for Xnode devices on the local network</span>
        </div>
      </div>
      <Dialog
        open={activateXnode !== undefined}
        onOpenChange={() => setActivateXnode(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate Xnode</DialogTitle>
            <DialogDescription>
              Register the wallet that controls this Xnode. Please note that
              this can only be changed{' '}
              <strong>with signature of the controlling wallet</strong>! If you
              lose your wallet, you cannot access or change this Xnode anymore.
              You can always reset an Xnode to factory settings, but you will
              lose all data and changes made.
            </DialogDescription>
          </DialogHeader>
          <div>
            <span>Controller Wallet</span>
            <w3m-button />
          </div>
          <Button onClick={() => push('/deployments')}>Activate</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

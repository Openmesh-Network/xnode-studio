'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { XnodeUnitEntitlementContract } from '@/contracts/XnodeUnitEntitlement'
import { XnodeUnitEntitlementClaimerContract } from '@/contracts/XnodeUnitEntitlementClaimer'
import { chain } from '@/utils/chain'
import { reviver } from '@/utils/json'
import { prefix } from '@/utils/prefix'
import { type CheckedState } from '@radix-ui/react-checkbox'
import { useQueryClient } from '@tanstack/react-query'
import { useWindowSize } from '@uidotdev/usehooks'
import axios from 'axios'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { Check, MoveRight, X } from 'lucide-react'
import ReactConfetti from 'react-confetti'
import { FlipTilt } from 'react-flip-tilt'
import ReCAPTCHA from 'react-google-recaptcha'
import {
  Address,
  decodeEventLog,
  Hex,
  keccak256,
  Signature,
  toBytes,
  zeroAddress,
} from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import { usePerformTransaction } from '@/hooks/usePerformTransaction'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Icons } from '@/components/Icons'
import ActivateXNodeDialog from '@/components/xnode/activate-dialog'

export default function ClaimXNodePage() {
  const captchaRef = useRef<ReCAPTCHA>()
  const formRef = useRef<HTMLFormElement>()
  const [tocChecked, setTocChecked] = useState<CheckedState>(false)

  const { width, height } = useWindowSize()

  const chainId = chain.id
  const { address, status } = useAccount()
  const { data: walletClient } = useWalletClient({ chainId })
  const publicClient = usePublicClient({ chainId })
  const { performingTransaction, performTransaction, loggers } =
    usePerformTransaction({
      chainId,
    })
  const queryClient = useQueryClient()

  const [pinInput, setPinInput] = useState<string | null>()

  const [successOpen, setSuccessOpen] = useState(false)
  const [claimedNft, setClaimedNft] = useState<bigint | null>()
  const [activationOpen, setActivationOpen] = useState<boolean>(false)

  return (
    <>
      <ReCAPTCHA
        ref={captchaRef}
        size="invisible"
        sitekey="6Lc2lvMpAAAAAHxzGM9-vWQr4zDngWZNZodIp1iV"
      />
      <div className="pointer-events-none fixed inset-0 z-[999]">
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={successOpen ? 500 : 0}
          onConfettiComplete={(confetti) => {
            confetti.reset()
          }}
        />
      </div>
      <ActivateXNodeDialog
        address={address}
        open={activationOpen}
        onOpenChange={setActivationOpen}
        entitlementNft={claimedNft ?? undefined}
      />
      <section className="container my-12 grid max-w-none grid-cols-5 gap-20">
        <div className="col-span-3">
          <h1 className="text-4xl font-bold">Claim your Xnode One</h1>
          <p className="mt-2">
            Unleash the Power of Xnode: Your Gateway to Building Personalized
            Data Ecosystems in minutes, instead of weeks. Claim you. Build 1000s
            of apps. Trade. Rent.
            <br />
            <span className="text-primary underline">Show me how</span>
          </p>
          <div className="mt-8">
            <div className="flex gap-12 text-muted-foreground">
              <p className="text-3xl">
                27x <span className="text-base">Cheaper</span>
              </p>
              <p className="text-3xl">
                6x <span className="text-base">Faster</span>
              </p>
              <p className="text-3xl">
                19x <span className="text-base">Better</span>
              </p>
            </div>
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-2">
                <p className="shrink-0 basis-1/6">Xnode</p>
                <div className="h-2.5 w-24 rounded-full bg-gradient-to-r from-green-300 to-green-500" />
              </div>
              <div className="flex items-center gap-2">
                <p className="shrink-0 basis-1/6">Competitors</p>
                <div className="h-2.5 w-[40rem] rounded-full bg-gradient-to-r from-green-400 via-orange-500 to-red-600" />
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full bg-green-600">
                  <Check className="size-4 text-background" />
                </div>
                No license, no setup fees.
              </div>
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full bg-green-600">
                  <Check className="size-4 text-background" />
                </div>
                Pay only for bare metal servers.
              </div>
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full bg-green-600">
                  <Check className="size-4 text-background" />
                </div>
                Connect to hundreds of apps
              </div>
            </div>
          </div>
          <form
            ref={formRef}
            action={async () => {
              const code = pinInput
                .toUpperCase()
                .replace(/(.{3})(.{3})(.{3})/, '$1-$2-$3')

              const nftId = BigInt(keccak256(toBytes(code)))
              const owner = await publicClient
                .readContract({
                  abi: XnodeUnitEntitlementContract.abi,
                  address: XnodeUnitEntitlementContract.address,
                  functionName: 'ownerOf',
                  args: [nftId],
                })
                .catch((err) => {
                  console.error(err)
                  return zeroAddress // On error, assume it's not owned
                })
              if (owner !== zeroAddress) {
                toast({
                  title: 'Code already claimed.',
                  description: 'This code has already been redeemed.',
                  variant: 'destructive',
                })
                return
              }
              await performTransaction({
                transactionName: 'Claim',
                transaction: async () => {
                  loggers?.onUpdate?.({
                    title: 'Verify you are human',
                    description: 'Solve the captcha request.',
                  })

                  console.log('recaptcha request')
                  const recaptchaToken: string = await captchaRef.current
                    .executeAsync()
                    .finally(() => {
                      captchaRef.current.reset()
                    })
                  console.log('recaptcha solved', recaptchaToken)

                  loggers?.onUpdate?.({
                    title: 'Validating code',
                    description: 'Getting smart contract proof...',
                  })
                  console.log('sending request to xue-signer')
                  const response = await axios
                    .post(`${prefix}/xue-signer/getSig`, {
                      code: code,
                      receiver: walletClient.account.address,
                      recaptcha: recaptchaToken,
                    })
                    .then(
                      (res) =>
                        JSON.parse(JSON.stringify(res.data), reviver) as {
                          message: {
                            receiver: Address
                            codeHash: Hex
                            claimBefore: number
                          }
                          signature: Signature
                        }
                    )
                    .catch((err: { response: { data: string } }) => {
                      console.error(err)
                      return err.response.data
                    })

                  if (typeof response === 'string') {
                    // An error has occurred, likely an invalid code
                    loggers?.onError?.({
                      title: 'Claim failed',
                      description: response,
                    })
                    return undefined
                  }

                  return {
                    abi: XnodeUnitEntitlementClaimerContract.abi,
                    address: XnodeUnitEntitlementClaimerContract.address,
                    functionName: 'claim',
                    args: [
                      response.message.receiver,
                      response.message.codeHash,
                      response.message.claimBefore,
                      Number(response.signature.v),
                      response.signature.r,
                      response.signature.s,
                    ],
                  }
                },
                onConfirmed: (receipt) => {
                  let mintedNft: bigint | undefined
                  receipt.logs.forEach((log) => {
                    try {
                      if (
                        log.address.toLowerCase() !==
                        XnodeUnitEntitlementContract.address.toLowerCase()
                      ) {
                        // Only interested in logs originating from the tasks contract
                        return
                      }

                      const mintEvent = decodeEventLog({
                        abi: XnodeUnitEntitlementContract.abi,
                        eventName: 'Transfer',
                        topics: (log as any).topics,
                        data: log.data,
                      })
                      mintedNft = mintEvent.args.tokenId
                    } catch {}
                  })
                  if (mintedNft === undefined) {
                    loggers.onError?.({
                      title: 'Error retrieving nft id',
                      description: 'Mint possibly failed.',
                    })
                  }
                  setClaimedNft(mintedNft)
                  setSuccessOpen(true)
                  queryClient.invalidateQueries({ queryKey: [address] })
                },
              })
            }}
            className="mt-16 rounded border p-6"
          >
            <div className="flex items-center gap-12">
              <div>
                <h3 className="text-xl font-bold">Step 1</h3>
                <p className="text-muted-foreground">Connect your wallet</p>
                <div className="mt-4 w-full">
                  {!address && status === 'disconnected' ? (
                    <w3m-connect-button />
                  ) : (
                    <w3m-account-button />
                  )}
                  <p className="mt-2 text-sm text-muted-foreground underline underline-offset-2">
                    How to get a web3 wallet
                  </p>
                </div>
              </div>
              <MoveRight
                className="size-8 shrink-0 grow text-muted-foreground"
                strokeWidth={1.5}
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold">Step 2</h3>
                <p className="text-muted-foreground">Enter PIN for the Xnode</p>
                <div className="mt-4">
                  <InputOTP
                    name="pin"
                    required
                    value={pinInput}
                    onChange={setPinInput}
                    maxLength={9}
                    inputMode="text"
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    autoCorrect="off"
                    spellCheck="false"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot className="h-10 w-8" index={0} />
                      <InputOTPSlot className="h-10 w-8" index={1} />
                      <InputOTPSlot className="h-10 w-8" index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot className="h-10 w-8" index={3} />
                      <InputOTPSlot className="h-10 w-8" index={4} />
                      <InputOTPSlot className="h-10 w-8" index={5} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot className="h-10 w-8" index={6} />
                      <InputOTPSlot className="h-10 w-8" index={7} />
                      <InputOTPSlot className="h-10 w-8" index={8} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="mt-2 text-sm text-muted-foreground underline underline-offset-2">
                  I don&apos;t have one
                </p>
              </div>
            </div>
            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-1.5">
                <Checkbox
                  checked={tocChecked}
                  onCheckedChange={setTocChecked}
                  required
                  id="xnode-toc"
                />
                <Label htmlFor="xnode-toc" className="text-muted-foreground">
                  I accept the Terms & Conditions
                </Label>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    disabled={
                      !address ||
                      pinInput?.length !== 9 ||
                      !tocChecked ||
                      performingTransaction
                    }
                    size="lg"
                    className="min-w-72"
                  >
                    Claim
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to claim?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to activate your Xnode. Doing this will
                      trigger the 12 month countdown after which your VPS will
                      no longer work. You can transfer your entitlement NFT as
                      well as your Xnode NFT at any time. This decision is final
                      and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="min-w-28">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        type="submit"
                        size="lg"
                        className="min-w-48"
                        onClick={() => {
                          formRef.current.requestSubmit()
                        }}
                      >
                        Claim
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
          <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
            <DialogContent>
              <div className="mb-4 mt-8 flex flex-col items-center justify-center">
                <div className="relative">
                  <Check className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-background" />
                  <Icons.PrettyCheck className="size-32 text-primary" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-primary">
                  Success
                </h3>
                <p className="text-lg font-semibold">
                  Your Xnode One is activated
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  You successfully redeemed the 12 month access to your own
                  Xnode. Currently there is no deployment running on your Xnode.
                </p>
              </div>
              <DialogFooter>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 basis-2/5"
                  onClick={() => setSuccessOpen(false)}
                >
                  Close
                </Button>
                <Button
                  size="lg"
                  className="flex-1 basis-3/5"
                  onClick={() => {
                    setSuccessOpen(false)
                    setActivationOpen(true)
                  }}
                >
                  Activate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="col-span-2">
          <div className="mx-auto w-4/5">
            <FlipTilt
              shadowEnable={false}
              front={'./images/xnode-card/silvercard-front.webp'}
              back={'./images/xnode-card/silvercard-back.webp'}
            />
          </div>
          <div className="mt-12">
            <h3 className="text-xl text-muted-foreground">
              Why is it different?
            </h3>
            {/* eslint-disable-next-line tailwindcss/migration-from-tailwind-2 */}
            <table className="mt-4 w-full overflow-clip rounded">
              <thead>
                <tr className="bg-muted">
                  <th className="h-8 px-6 text-start text-sm font-medium">
                    Node
                  </th>
                  <th className="h-8 px-4 text-start text-sm font-medium">
                    Price
                  </th>
                  <th className="h-8 px-4 text-start text-sm font-medium">
                    KYC
                  </th>
                  <th className="h-8 px-4 text-start text-sm font-medium">
                    Web3
                  </th>
                  <th className="h-8 px-4 text-start text-sm font-medium">
                    Ownership
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td title="Xnode" className="h-14 border-r px-6">
                    <Image
                      src={`${prefix}/images/xnode-card/silvercard-front.webp`}
                      alt="xnode card"
                      width={48}
                      height={28}
                      className="object-contain"
                    />
                  </td>
                  <td className="h-14 border-r px-4 font-bold">Free</td>
                  <td className="h-14 border-r px-4">No</td>
                  <td className="h-14 border-r px-4">
                    <Check className="size-4 text-green-500" />
                  </td>
                  <td className="h-14 px-4">Decentralized</td>
                </tr>
                <tr className="border-b">
                  <td title="AWS" className="h-14 border-r px-6">
                    <Image
                      src={`${prefix}/images/cloudLogo/aws.png`}
                      alt="aws logo"
                      width={48}
                      height={28}
                      className="object-contain"
                    />
                  </td>
                  <td className="h-14 border-r px-4 font-bold">$2,500</td>
                  <td className="h-14 border-r px-4">Mandatory</td>
                  <td className="h-14 border-r px-4">
                    <X className="size-4 text-red-500" />
                  </td>
                  <td className="h-14 px-4">Centralized</td>
                </tr>
                <tr className="border-b">
                  <td title="GCP" className="h-14 border-r px-6">
                    <Image
                      src={`${prefix}/images/subNavBarServers/gcp.svg`}
                      alt="gcp logo"
                      width={48}
                      height={28}
                      className="object-contain"
                    />
                  </td>
                  <td className="h-14 border-r px-4 font-bold">$3,100</td>
                  <td className="h-14 border-r px-4">Mandatory</td>
                  <td className="h-14 border-r px-4">
                    <X className="size-4 text-red-500" />
                  </td>
                  <td className="h-14 px-4">Centralized</td>
                </tr>
                <tr className="border-b">
                  <td title="Azure" className="h-14 border-r px-6">
                    <Image
                      src={`${prefix}/images/subNavBarServers/azure.svg`}
                      alt="azure logo"
                      width={48}
                      height={28}
                      className="object-contain"
                    />
                  </td>
                  <td className="h-14 border-r px-4 font-bold">$3,500</td>
                  <td className="h-14 border-r px-4">Mandatory</td>
                  <td className="h-14 border-r px-4">
                    <X className="size-4 text-red-500" />
                  </td>
                  <td className="h-14 px-4">Centralized</td>
                </tr>
                <tr>
                  <td
                    title="Azure"
                    className="h-14 border-r px-6 font-semibold leading-tight text-muted-foreground"
                  >
                    Other
                    <br /> Providers
                  </td>
                  <td className="h-14 border-r px-4 font-bold">$1,900</td>
                  <td className="h-14 border-r px-4">No</td>
                  <td className="h-14 border-r px-4">
                    <X className="size-4 text-red-500" />
                  </td>
                  <td className="h-14 px-4">Depends</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}

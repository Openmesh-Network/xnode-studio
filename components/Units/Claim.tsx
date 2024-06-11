'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { XnodeUnitEntitlementContract } from '@/contracts/XnodeUnitEntitlement'
import { XnodeUnitEntitlementClaimerContract } from '@/contracts/XnodeUnitEntitlementClaimer'
import { chain } from '@/utils/chain'
import { reviver } from '@/utils/json'
import { prefix } from '@/utils/prefix'
import { useWindowSize } from '@uidotdev/usehooks'
import axios from 'axios'
import ReactConfetti from 'react-confetti'
import ReCAPTCHA from 'react-google-recaptcha'
import {
  Address,
  BaseError,
  ContractFunctionRevertedError,
  Hex,
  keccak256,
  Signature,
  toBytes,
  zeroAddress,
} from 'viem'
import {
  useAccount,
  useDisconnect,
  usePublicClient,
  useWalletClient,
} from 'wagmi'

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { ToastAction } from '../ui/toast'
import { useToast } from '../ui/use-toast'

const codeRegex = new RegExp('^.{3}-.{3}-.{3}$')

const Claim = ({ chainId }: { chainId: number }) => {
  const [code, setCode] = useState<string>('')
  const [invalidCode, setInvalidCode] = useState<string | undefined>(undefined)
  const [successOpen, setSuccessOpen] = useState<boolean>(false)
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
  const { disconnect } = useDisconnect()
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })
  const { toast } = useToast()
  const router = useRouter()
  const recaptchaRef = React.useRef<ReCAPTCHA>()
  const { width, height } = useWindowSize()

  useEffect(() => {
    // Check if semantics of the code are valid
    if (!code.match(codeRegex)) {
      setInvalidCode('Code must be of format ABC-ABC-ABC')
      return
    }

    // Check if the code has already been used
    const checkAlreadyMinted = async () => {
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
        return 'Code has already been used.'
      }
      return undefined // Success
    }

    checkAlreadyMinted().then(setInvalidCode).catch(console.error)
  }, [code, publicClient])

  const [submitting, setSubmitting] = useState<boolean>(false)
  const redeemCode = async () => {
    if (submitting) {
      toast({
        title: 'Please wait',
        description: 'The past submission is still running.',
        variant: 'destructive',
      })
      return
    }

    const submit = async () => {
      setSubmitting(true)
      let { dismiss } = toast({
        title: 'Verify you are human',
        description: 'Solve the captcha request.',
      })
      if (!publicClient || !walletClient?.account) {
        dismiss()
        toast({
          title: 'Claim failed',
          description: `${publicClient ? 'Wallet' : 'Public'}Client is undefined.`,
          variant: 'destructive',
        })
        return
      }

      console.log('recaptcha request')

      const recaptchaToken: string = await recaptchaRef.current
        .executeAsync()
        .finally(() => {
          recaptchaRef.current.reset()
        })
      console.log('recaptcha solved', recaptchaToken)
      dismiss()
      dismiss = toast({
        title: 'Validating code',
        description: 'Getting smart contract proof...',
      }).dismiss
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
              message: { receiver: Address; codeHash: Hex; claimBefore: number }
              signature: Signature
            }
        )
        .catch((err: { response: { data: string } }) => {
          console.error(err)
          return err.response.data
        })

      if (typeof response === 'string') {
        // An error has occurred, likely an invalid code
        dismiss()
        toast({
          title: 'Claim failed',
          description: response,
          variant: 'destructive',
        })
        return
      }

      dismiss()
      dismiss = toast({
        title: 'Generating transaction',
        description: 'Please sign the transaction in your wallet...',
      }).dismiss
      console.log('making transaction request')
      const transactionRequest = await publicClient
        .simulateContract({
          account: walletClient.account,
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
          chain: chain,
        })
        .catch((err) => {
          console.error(err)
          if (err instanceof BaseError) {
            let errorName = err.shortMessage ?? 'Simulation failed.'
            const revertError = err.walk(
              (err) => err instanceof ContractFunctionRevertedError
            )

            if (revertError instanceof ContractFunctionRevertedError) {
              errorName += ` -> ${revertError.data?.errorName}` ?? ''
            }
            return errorName
          }
          return 'Simulation failed.'
        })
      if (typeof transactionRequest === 'string') {
        dismiss()
        toast({
          title: 'Claim failed',
          description: transactionRequest,
          variant: 'destructive',
        })
        return
      }

      console.log('Getting transaction hash')
      const transactionHash = await walletClient
        .writeContract(transactionRequest.request)
        .catch((err) => {
          console.error(err)
          return undefined
        })
      if (!transactionHash) {
        dismiss()
        toast({
          title: 'Claim failed',
          description: 'Transaction rejected.',
          variant: 'destructive',
        })
        return
      }

      console.log('Getting receipt')
      dismiss()
      dismiss = toast({
        duration: 120_000, // 2 minutes
        title: 'Claim transaction submitted',
        description: 'Waiting until confirmed on the blockchain...',
        action: (
          <ToastAction
            altText="View on explorer"
            onClick={() => {
              window.open(
                `${chain.blockExplorers.default.url}/tx/${transactionHash}`,
                '_blank'
              )
            }}
          >
            View on explorer
          </ToastAction>
        ),
      }).dismiss

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      })

      dismiss()
      setSuccessOpen(true)
    }

    await submit().catch(console.error)
    setSubmitting(false)
  }

  return (
    <>
      <h1 className="text-4xl font-semibold text-black"> Claim your Xnode </h1>
      <p>
        {' '}
        Unleash the power of Xnode, your gateway to building a personalized
        server in minutes instead of weeks.{' '}
      </p>

      <br />

      <div className="flex flex-row justify-between">
        <div className="">
          <p className="font-semibold"> Step 01. </p>
          <p> Connect your wallet. </p>
          <Popover>
            <PopoverTrigger className="text-blue-700 underline">
              How to get a wallet?
            </PopoverTrigger>
            <PopoverContent>
              <ol>
                <li>
                  1. Choose a wallet provider (MetaMask, Ledger, Brave, etc).
                </li>
                <li>2. Create a new ethereum wallet. </li>
                <li>3. Add funds and select connect. </li>
              </ol>
            </PopoverContent>
          </Popover>
        </div>
        <div className="">
          <span className="flex flex-row">
            {walletClient?.account.address !== undefined && (
              <p
                className="ml-[8px] text-[10px] font-normal"
                onClick={() => disconnect()}
              >
                Disconnect
              </p>
            )}
          </span>

          {walletClient?.account.address !== undefined ? (
            <input
              className="m-0 h-[50px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
              type="text"
              value={walletClient?.account.address ?? ''}
              readOnly={true}
            />
          ) : (
            <w3m-connect-button />
          )}
        </div>
      </div>

      <br />
      <br />
      <br />

      <div className="flex flex-row justify-between">
        <div>
          <p className="font-semibold"> Step 02. </p>
          <p> Enter your pin from the Xnode card. </p>
          <Popover>
            <PopoverTrigger className="text-blue-700 underline">
              I don&apos;t have one.
            </PopoverTrigger>
            <PopoverContent>
              A code is required to redeem the Xnode NFT.
              <br /> Be on the look out on social media or IRL events for
              giveaways!
            </PopoverContent>
          </Popover>
        </div>

        <div className="">
          <span className="flex flex-row">
            <p className="ml-[8px] text-[10px] font-normal text-[#ff0000]">
              {invalidCode !== undefined ? '* ' + invalidCode : ''}
            </p>
          </span>
          <input
            className="mt-[10px] h-[50px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
            type="text"
            value={code}
            onChange={(e) => {
              let newCode = e.target.value.toUpperCase()
              if (newCode.length == 3 || newCode.length == 7) {
                newCode += '-'
              }
              if (newCode.endsWith('--')) {
                newCode = newCode.substring(0, newCode.length - 1)
              }
              setCode(newCode)
            }}
          />
        </div>
      </div>

      <br />
      <br />
      <br />

      <div className="flex flex-row justify-between">
        <div>
          <p className="font-semibold"> Step 03. </p>
          <p> Claim your Xnode. </p>
          <p> Build 100s of apps. Trade. Rent. </p>
        </div>

        <div className="">
          <button
            className="cursor-pointer items-center rounded-[5px] border border-blue500 bg-blue500 px-[25px] py-[8px] text-[13px] font-bold !leading-[19px] text-[#FFFFFF] hover:bg-[#064DD2] lg:text-[16px]"
            disabled={
              invalidCode !== undefined ||
              walletClient?.account === undefined ||
              submitting
            }
            onClick={() => setConfirmOpen(true)}
          >
            Claim
          </button>
        </div>
      </div>

      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey="6Lc2lvMpAAAAAHxzGM9-vWQr4zDngWZNZodIp1iV"
      />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to claim your Xnode?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will mint an entitlement for the currently selected wallet.
              By clicking continue you also agree to our terms and conditions.
              Claiming requires your wallet to have enough funds to cover the
              gas fee.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => redeemCode().catch(console.error)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success alert. */}
      <AlertDialog open={successOpen} onOpenChange={setSuccessOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <div
            className="fixed inset-0"
            style={{ transform: `translate(-300%, -300%)` }}
          >
            <ReactConfetti
              width={width * 3}
              height={height * 3}
              numberOfPieces={1000}
            />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Congratulations!</AlertDialogTitle>
            <AlertDialogDescription>
              You have successfully claimed your Xnode. It will now be available
              for activation on the dashboard.
              <br />
              Click continue to be redirected there.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push(prefix + '/dashboard')}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Claim

'use client'

import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AccountContext } from '@/contexts/AccountContext'
import { XnodeUnitEntitlementContract } from '@/contracts/XnodeUnitEntitlement'
import { XnodeUnitEntitlementClaimerContract } from '@/contracts/XnodeUnitEntitlementClaimer'
import { reviver } from '@/utils/json'
import axios from 'axios'
import nookies, { setCookie } from 'nookies'
import { toast } from 'react-toastify'
import { getWeb3Login } from 'utils/auth'
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

const Claim = ({ chainId }: { chainId: number }) => {
  const [code, setCode] = useState<string>('')
  const [invalidCode, setInvalidCode] = useState<string | undefined>(undefined)
  const [successOpen, setSuccessOpen] = useState<boolean>(false)
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
  const account = useAccount()
  const { disconnect } = useDisconnect()
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })
  const router = useRouter()
  const { user, setUser } = useContext(AccountContext)

  useEffect(() => {
    // Check if semantics of the code are valid
    if (code.length != 9) {
      setInvalidCode('Code must be 9 characters long.')
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

    checkAlreadyMinted().then((err) => {
      if (err) {
        toast.error("Error: " + err)
      } else {
        toast.success("Success")
      }
    })
  }, [code, publicClient])

  const redeemCode = async () => {
    setConfirmOpen(true)

    if (!walletClient) {
      alert('WalletClient undefined.')
      return
    }

    console.log('sending request to xue-signer')
    const response = await axios
      .post('/xue-signer/getSig', {
        code: code,
        receiver: account.address,
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
      alert(response)
      return
    }

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
      alert(transactionRequest)
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
      alert('Transaction rejected.')
      return
    }

    console.log('Getting receipt')

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    })

    alert(`Success: ${receipt.transactionHash}`)

    // At this point the user has successfully claimed the Xnode.

    // TODO: Trigger success animation.
    // TODO: Popup that explains next step.
    // TODO: Redirect to deployment page.
    setSuccessOpen(true)
  }

  const { address } = useAccount()

  const tryLogin = async () => {
    console.log('Login initiated!')
    try {
      const res = await getWeb3Login(address)
      if (res) {
        console.log(user)
        console.log(res)
        setUser(res)
        console.log('Success!')
        toast.success('Logged in!')
      }
    } catch (err) {
      console.log('Error loging in with Web3', err)
      toast.error(err)
      return
    }
    console.log('Login over!')
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
              {' '}
              How to get a wallet?{' '}
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
            {account.address !== undefined && (
              <p
                className="ml-[8px] text-[10px] font-normal"
                onClick={() => disconnect()}
              >
                Disconnect
              </p>
            )}
          </span>

          {account.address !== undefined ? (
            <input
              className="m-0 h-[50px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
              type="text"
              value={account.address ?? ''}
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
              {' '}
              I don&apos;t have one.{' '}
            </PopoverTrigger>
            <PopoverContent>
              {' '}
              A code is required to redeem the Xnode NFT.
              <br /> Be on the look out on social media or IRL events for
              giveaways!{' '}
            </PopoverContent>
          </Popover>
        </div>

        <div className="">
          {/* <span className="flex flex-row"> */}
          {/* <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] "> */}
          {/* {invalidCode !== undefined ? "* " + invalidCode : "" } */}
          {/* </p> */}
          {/* </span> */}
          <input
            className="mt-[10px] h-[50px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
              /* XXX: Reenable this:  */
              false /* invalidCode !== undefined || walletClient === undefined || account.address !== undefined */
            }
            onClick={() => setConfirmOpen(true)}
          >
            Claim
          </button>
        </div>
      </div>

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
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              You have succesfully claimed your Xnode. It will now be available
              for activation on the dashboard.
              <br />
              Click continue to be redirected there.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/dashboard')}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Claim

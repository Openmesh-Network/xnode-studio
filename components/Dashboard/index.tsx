'use client'

/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { ToastAction } from '../ui/toast'
import { getXueNfts } from 'utils/nft'

import 'react-toastify/dist/ReactToastify.css'

import { useRouter } from 'next/navigation'
import { XnodeUnitEntitlementContract } from '@/contracts/XnodeUnitEntitlement'
import { chain } from '@/utils/chain'
import { prefix } from '@/utils/prefix'
import axios from 'axios'
import { useUser } from 'hooks/useUser'
import { parseCookies } from 'nookies'
import { SmileySad } from 'phosphor-react'
import { useAccount } from 'wagmi'
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

import { Xnode } from '../../types/node'

import { useXuNfts } from 'utils/nft'
import { BaseError, ContractFunctionRevertedError } from 'viem'
import { useWalletClient, usePublicClient } from 'wagmi'
import { XnodeUnitContract } from '@/contracts/XnodeUnit'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [xnodesData, setXnodesData] = useState<Xnode[] | []>([])
  const [activateWarnOpen, setActivateWarnOpen] = useState<boolean>(false)
  const [waitOpen, setWaitOpen] = useState<boolean>(false)
  const [successOpen, setSuccessOpen] = useState<boolean>(false)
  const [timeTillActivation, setTimeTillActivation] = useState<string>("72 hours 0 minutes 0 seconds")
  const [xueNfts, setXueNfts] = useState<BigInt[]>(undefined)
  const [selectedNft, setSelectedNft] = useState<BigInt>(undefined)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const account = useAccount()

  const { address, isConnecting, isDisconnected, isConnected } = account

  const { 
    data : xuNfts,
    refetch: refetchXuNFTs,
  } = useXuNfts(address)

  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [user] = useUser()

  const { push } = useRouter()
  const { toast } = useToast()

  const tryActivateNFT = () => {
    // We check if the user is whitelisted since we don't want users to activate machines that can't be deployed yet.
    const whitelist = [
      "0xc2859E9e0B92bf70075Cd47193fe9E59f857dFA5",
    ];

    let isWhitelisted = false
    for (let i = 0; i < whitelist.length; i++) {
      if (whitelist[i] == address) {
        isWhitelisted = true
        break
      }
    }

    if (!isWhitelisted) {
      // Throw alert.
      setWaitOpen(true)
    } else {
      setActivateWarnOpen(true)
    }
  }

  const activateNFT = async () => {
    if (submitting) {
      toast({
        title: 'Please wait',
        description: 'The past submission is still running.',
        variant: 'destructive',
      })
      return
    }

    if (!selectedNft) {
      alert('No NFT selected.')
      return
    }
    if (!walletClient) {
      alert('WalletClient undefined.')
      return
    }

    let dismiss = toast({
      title: 'Generating transaction',
      description: 'Please sign the transaction in your wallet...',
    }).dismiss

    const transactionRequest = await publicClient
    .simulateContract({
      account: walletClient.account,
      abi: XnodeUnitEntitlementContract.abi,
      address: XnodeUnitEntitlementContract.address,
      functionName: 'activate',
      args: [selectedNft as bigint],
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
      dismiss = toast({
        title: 'Transaction failed',
        description: 'Please sign the transaction in your wallet...',
      })
      return
    }

    setSubmitting(true)
    dismiss = toast({
      title: 'Submitting',
      description: 'Please sign the transaction in your wallet...',
    })
    const transactionHash = await walletClient
    .writeContract(transactionRequest.request)
    .catch((err) => {
      console.error(err)
      return undefined
    })
    if (!transactionHash) {
      alert('Transaction rejected.')
      dismiss = toast({
        title: 'Transaction rejected',
        description: '...',
      })
      return
    }

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
    }).dismiss()

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    })

    // alert(`Success: ${receipt.transactionHash}`)

    setSuccessOpen(true)
    setSubmitting(false)
  }

  const getEtherscanUrl = (isXue: boolean, id: string) => {
    let prefix = ""
    if (chain.name === "Sepolia") {
      prefix = "sepolia."
    }

    let contractAddress = ""
    if (isXue) {
      contractAddress = XnodeUnitEntitlementContract.address
    } else {
      contractAddress = XnodeUnitContract.address
    }

    return "https://" + prefix + "etherscan.io/nft/" + contractAddress + "/" + id
  }


  const startCountdown = () => {

    setInterval(() => {
      let newTime = ""
      const today = new Date()
      const total = Date.parse("2024-06-14T22:30:00+10:00") - today.getTime();
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor(
        (total / 1000 / 60) % 60
      );
      const hours = Math.floor(
        (total / 1000 / 60 / 60) % 128
      );

      let m = "" + minutes
      if (minutes < 10) {
        m = "0" + m
      }

      let s = "" + seconds
      if (seconds < 10) {
        s = "0" + seconds
      }

      newTime = hours + ":" + m + ":" + s

      setTimeTillActivation(newTime)
    }, 1000);
  }

  useEffect(() => {
    // XXX: User isn't logged in!
    // This is big problem.
    // Correct behaviour:
    //  - Ask for login to view actual deployments?
    //  - Keep list of pending deployments available.

    if (!account?.address) {
      console.error('No address on account!')
      setXueNfts([])
    } else {
      const findXueForAccount = async () => {
        let nfts = await getXueNfts(account).catch(console.error)
        if (nfts) {
          // Only update XueNfts if the nfts don't match. Don't want to trigger pointless updates.

          let doUpdate = false
          if (!xueNfts) {
            doUpdate = true
          } else if (xueNfts.length != nfts.length) {
            doUpdate = true
          } else {
            for (let i = 0; i < xueNfts.length; i++) {
              if (xueNfts[i] != nfts[i]) {
                doUpdate = true
                break
              }
            }
          }

          if (doUpdate) {
            setXueNfts(nfts)
          }

          console.log('Found NFT array for current wallet address:')
          console.log(nfts)
        } else {
          console.log('Failed to get NFTS.')
          console.log(nfts)
        }
      }

      findXueForAccount()
      refetchXuNFTs()
    }

    if (!user) {
      // TODO: Prompt log-in in this case.
      // push(
      //   `${process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD' ? `/xnode/` : `/`}`
      // )
    } else {
      // getData()
      // alert('User has a cookie.')
    }
  }, [account?.isConnected, setSubmitting])

  useEffect(() => {
    startCountdown()   
  }, [])

  const commonClasses =
    'pb-[17.5px] whitespace-nowrap font-normal text-[8px] md:pb-[21px] lg:pb-[24.5px] xl:pb-[28px] 2xl:pb-[35px] 2xl:text-[16px] md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px]'

  return (
    <>
      <AlertDialog open={activateWarnOpen} onOpenChange={setActivateWarnOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning!</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to activate your Xnode.
              <br/>
              Doing this will trigger the 12 month countdown after which your VPS will no longer work.

              <br/>
              You can transfer your entitlement NFT as well as your Xnode NFT at any time.

              <br/>
              <br/>
              <b>By activating your Xnode NFT you agree to our <a className="text-blue-500 underline" href=""> terms and conditions</a>.</b>

              <br/>
              <br/>
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => activateNFT()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={waitOpen} onOpenChange={setWaitOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{ timeTillActivation } Until Xnodes can be Activated </AlertDialogTitle>
            <AlertDialogDescription>
              <p>
                Stay posted on our <a className="text-blue-500 underline" href="https://discord.gg/GsYFuwGp">discord</a> or <a className="text-blue-500 underline" href="https://x.com/OpenmeshNetwork">twitter</a>.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              Ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={successOpen} onOpenChange={setSuccessOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              Your Xnode is now activated, but it&apos;s running no software.
              <br />
              Activate your Xnode by clicking the deploy button.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {/* <AlertDialogAction onClick={() => router.push(prefix + '/dashboard')}> */}
            <AlertDialogAction>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="m-20 flex-1">
        <section>
          <h1 className="text-4xl font-semibold text-black">Dashboard</h1>
          <div className="my-12" />

          {
            (!account?.isConnected) ? (
              <div>
                <p> Connect your wallet to view available Xnodes and entitlements. </p>
                <w3m-connect-button />
              </div>
            )
            : (
              <>
                <w3m-button />
              </>
            )
          }

          <div className="flex flex-rows justify-around">
          {
            // TODO: Add check with wallet connect here.
            (xueNfts && account?.isConnected && xueNfts?.length > 0) && (
              <div>
                <div className="text-[10px] font-bold text-[#313131] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
                  Wallet has {xueNfts.length}{' '}
                  {xueNfts.length == 1 ? 'Xnode' : 'Xnodes'} available for
                  activation.
                </div>

                <ul className="mt-4 flex flex-col items-center gap-8 overflow-y-auto text-black">
                  {
                    xueNfts.map((xueId, index) => (
                      <li key={index} className="flex w-[500px] items-start gap-12 rounded-lg border-2 border-primary/30 p-6 shadow-[0_0.75rem_0.75rem_hsl(0_0_0/0.05)]">
                        {/* <p> Your id is: {node.toString()} </p> */}

                      {/* <div> */}
                      {/*   { node.toString() } */}
                      {/* </div> */}

                        <div>
                          <ul>
                            <li> <b>Xnode Entitlement NFT</b> </li>
                            <li> 2 weeks GPU </li>
                            <li> 11.5 months CPU </li>
                          </ul>
                        </div>

                        <div className="flex flex-col h-full w-fit items-center justify-center align-middle">
                          <button className="inline-flex h-10 min-w-56 items-center justify-center whitespace-nowrap rounded-md border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            onClick={ () => { setSelectedNft(xueId); tryActivateNFT() } }> 
                            {
                              xueId == selectedNft && submitting ? (
                                "Activating..."
                              ) : (
                              "Activate Now"
                              )
                            }
                          </button>

                          <p className="mt-5"> <a className="text-blue-500 underline" href={
                              getEtherscanUrl(true, xueId.toString())
                            }> View on etherscan  </a> </p>
                        </div>

                      </li>
                    ))
                  }
                </ul>
              </div>
            )
          }

          {
            (xuNfts && account?.isConnected && xuNfts?.length > 0) && (
              <div>
                <div className="text-[10px] font-bold text-[#313131] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
                  Wallet has {xuNfts.length} active { xuNfts.length == 1 ? "Xnode" : "Xnodes" } waiting to be configured.
                </div>

                <ul className="mt-4 flex flex-col items-center gap-8 overflow-y-auto text-black">
                  {
                    xuNfts.map((xuId, index) => (
                      <li key={index} className="flex w-[500px] items-start gap-12 rounded-lg border-2 border-primary/30 p-6 shadow-[0_0.75rem_0.75rem_hsl(0_0_0/0.05)]">
                        <div>
                          <ul>
                            <li> <b> Xnode </b> </li>
                            <li> 2 weeks GPU </li>
                            <li> 11.5 months CPU </li>
                          </ul>
                        </div>

                        <div className="flex flex-col h-full w-fit items-center justify-center">
                          <button className="inline-flex h-10 min-w-56 items-center justify-center whitespace-nowrap rounded-md border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            onClick={ () => push((process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD' ? `/xnode/` : `/`) + 'templates?nftId=' + xuId.toString()) }> 

                            Deploy
                          </button>

                          <p className="mt-5"> <a className="text-blue-500 underline" href={
                            // XXX: Change this to eth, not sepolia!
                            getEtherscanUrl(false, xuId.toString())
                            }> View on etherscan  </a> </p>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
            )
          }

          </div>
          <p> View configured nodes on <a className="text-blue-500 underline" href={prefix + '/deployments'}> Deployments tab </a>. </p>
        </section>
      </div>
    </>
  )
}

export default Dashboard

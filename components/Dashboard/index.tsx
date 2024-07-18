'use client'

/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { XnodeUnitContract } from '@/contracts/XnodeUnit'
import { XnodeUnitEntitlementContract } from '@/contracts/XnodeUnitEntitlement'
import { chain } from '@/utils/chain'
import { prefix } from '@/utils/prefix'
import { useWindowSize } from '@uidotdev/usehooks'
import { useUser } from 'hooks/useUser'
import ReactConfetti from 'react-confetti'
import { getXueNfts, useXuNfts } from 'utils/nft'
import { Address, BaseError, ContractFunctionRevertedError } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

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
import { ToastAction } from '../ui/toast'
import { useToast } from '../ui/use-toast'
import axios from 'axios'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [xnodesData, setXnodesData] = useState<Xnode[]>([]);
  const [activateWarnOpen, setActivateWarnOpen] = useState<boolean>(false)
  const [waitOpen, setWaitOpen] = useState<boolean>(false)
  const [successOpen, setSuccessOpen] = useState<boolean>(false)
  const [timeTillActivation, setTimeTillActivation] = useState<string>(
    '72 hours 0 minutes 0 seconds'
  )
  const [xueNfts, setXueNfts] = useState<BigInt[]>(undefined)
  const [selectedNft, setSelectedNft] = useState<BigInt>(undefined)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const account = useAccount()

  const { address, isConnecting, isDisconnected, isConnected } = account

  const { data: xuNfts, refetch: refetchXuNFTs } = useXuNfts(address)

  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [user] = useUser()

  const { push } = useRouter()
  const { toast } = useToast()
  const { width, height } = useWindowSize()

  const tryActivateNFT = () => {
    // We check if the user is whitelisted since we don't want users to activate machines that can't be deployed yet.
    const whitelist = [
      '0xc2859E9e0B92bf70075Cd47193fe9E59f857dFA5',
      '0x99acBe5d487421cbd63bBa3673132E634a6b4720',
      '0x7703d5753C54852D4249F9784A3e8A6eeA08e1dD',
      '0xaF7E68bCb2Fc7295492A00177f14F59B92814e70',
      `0xA4a336783326241acFf520D91eb8841Ad3B9BD1a`,
      '0x87d795cbb0CABd0A68Df54E6a01033046919bA43',
      '0x00AbF21a1f81d348B848a035951396Db96f28b3a',
    ]

    let isWhitelisted = false
    for (let i = 0; i < whitelist.length; i++) {
      if (whitelist[i].toLowerCase() == address.toLowerCase()) {
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
  const getData = async () => {
    if (user?.sessionToken) {
      const config = {
        method: 'get' as 'get',
        url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/getXnodes`,
        headers: {
          'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
          'X-Parse-Session-Token': user.sessionToken,
          'Content-Type': 'application/json',
        },
      }

      try {
        await axios(config).then(function (response) {
          if (response.data) {
            console.log('Got the Xnode data')
            console.log(response.data)
            setXnodesData(response.data)
          }
        })
      } catch (err) {
        // toast({
        //   title: 'Error getting the Xnode list',
        //   description: err.response.data.message,
        //   variant: 'destructive',
        // })

        console.error("Couldnt get Xnode list: ", err)

      }
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

    const submit = async () => {
      setSubmitting(true)

      if (selectedNft === undefined) {
        toast({
          title: 'No NFT selected',
          description: 'Please select which NFT you want to activate.',
          variant: 'destructive',
        })
        return
      }

      let { dismiss } = toast({
        title: 'Generating transaction',
        description: 'Please sign the transaction in your wallet...',
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
        }).dismiss
        return
      }

      const transactionHash = await walletClient
        .writeContract(transactionRequest.request)
        .catch((err) => {
          console.error(err)
          return undefined
        })
      if (!transactionHash) {
        dismiss()
        dismiss = toast({
          title: 'Transaction rejected',
          description: transactionHash,
        }).dismiss
        return
      }

      dismiss = toast({
        duration: 120_000, // 2 minutes
        title: 'Activate transaction submitted',
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

      await findXueForAccount()
      await refetchXuNFTs()
    }

    await submit().catch(console.error)
    setSubmitting(false)
  }

  const startCountdown = () => {
    setInterval(() => {
      let newTime = ''
      const today = new Date()
      const total = Date.parse('2024-06-19T22:30:00+10:00') - today.getTime()
      const seconds = Math.floor((total / 1000) % 60)
      const minutes = Math.floor((total / 1000 / 60) % 60)
      const hours = Math.floor((total / 1000 / 60 / 60) % 24)
      const days = Math.floor((total / 1000 / 60 / 60 / 24) % 900)

      if (total < 0) {
        newTime = "Coming soon, stay posted on social media..."
      } else {
        newTime = days + ' day' + (days != 1 ? 's' : '')
        newTime += ' ' + hours + ' hour' + (hours != 1 ? 's' : '')
        newTime += ' ' + minutes + ' minute' + (minutes != 1 ? 's' : '')
        newTime += ' ' + seconds + ' second' + (seconds != 1 ? 's' : '')
      }

      setTimeTillActivation(newTime)
    }, 1000)
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
      findXueForAccount()
      refetchXuNFTs()
      getData()

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
  }, [account?.isConnected, setSuccessOpen, submitting, setSubmitting])

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
              <br />
              Doing this will trigger the 12 month countdown after which your
              VPS will no longer work.
              <br />
              You can transfer your entitlement NFT as well as your Xnode NFT at
              any time.
              <br />
              <br />
              <b>
                {' '}
                <a className="text-blue-500 underline" href="">
                  {' '}
                  Additional notes
                </a>
                .
              </b>
              <br />
              <br />
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
            <AlertDialogTitle>
              Xnode Activation will be enabled in{' '}
            </AlertDialogTitle>
            <AlertDialogDescription>
              <center>
                <p className="text-bold text-xl">{timeTillActivation} </p>

                <br />

                <p>
                  Stay posted on our{' '}
                  <a
                    className="text-blue-500 underline"
                    href="https://discord.com/invite/openmesh"
                    target="_blank"
                  >
                    discord
                  </a>{' '}
                  or{' '}
                  <a
                    className="text-blue-500 underline"
                    href="https://x.com/OpenmeshNetwork"
                    target="_blank"
                  >
                    twitter
                  </a>
                  .
                </p>
              </center>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Ok</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              Your Xnode is now activated, but it&apos;s running no software.
              <br />
              Activate your Xnode by clicking the deploy button.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {/* <AlertDialogAction onClick={() => router.push(prefix + '/dashboard')}> */}
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="m-20 flex-1">
        <section>
          <h1 className="text-4xl font-semibold text-black">Dashboard</h1>
          <div className="my-12" />

          {!account?.isConnected ? (
            <div>
              <p>
                {' '}
                Connect your wallet to view available Xnodes and entitlements.{' '}
              </p>
              <w3m-connect-button />
            </div>
          ) : (
            <>
              <w3m-button />
            </>
          )}

          <div className="flex-rows flex justify-around">
            {
              // TODO: Add check with wallet connect here.
              xueNfts && account?.isConnected && xueNfts?.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-[#313131] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
                    Wallet has {xueNfts.length}{' '}
                    {xueNfts.length == 1 ? 'Xnode' : 'Xnodes'} available for
                    activation.
                  </div>

                  <ul className="mt-4 flex flex-col items-center gap-8 overflow-y-auto text-black">
                    {xueNfts.map((xueId, index) => (
                      <li
                        key={index}
                        className="flex w-[500px] items-start gap-12 rounded-lg border-2 border-primary/30 p-6 shadow-[0_0.75rem_0.75rem_hsl(0_0_0/0.05)]"
                      >
                        <div>
                          <ul>
                            <li>
                              {' '}
                              <b>Xnode Entitlement NFT</b>{' '}
                            </li>
                            <li> 12 months CPU </li>
                            <li> 
                              <b> XUE ID: {String(xueNfts[index]).substring(0, 6)}... </b>
                            </li>
                          </ul>
                        </div>

                        <div className="flex h-full w-fit flex-col items-center justify-center align-middle">
                          <button
                            className="inline-flex h-10 min-w-56 items-center justify-center whitespace-nowrap rounded-md border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            onClick={() => {
                              setSelectedNft(xueId)
                              tryActivateNFT()
                            }}
                          >
                            {xueId == selectedNft && submitting
                              ? 'Activating...'
                              : 'Activate Now'}
                          </button>

                          <p className="mt-5">
                            {' '}
                            <a
                              className="text-blue-500 underline"
                              href={`${chain.blockExplorers.default.url}/nft/${XnodeUnitEntitlementContract.address}/${xueId.toString()}`}
                              target="_blank"
                            >
                              {' '}
                              View on etherscan{' '}
                            </a>{' '}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }

            {xuNfts && account?.isConnected && xuNfts?.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-[#313131] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
                  Wallet has {xuNfts.length} active{' '}
                  {xuNfts.length == 1 ? 'Xnode' : 'Xnodes'} waiting to be
                  configured.
                </div>

                <ul className="mt-4 flex flex-col items-center gap-8 overflow-y-auto text-black">
                  {xuNfts.reverse().map((xuId, index) => {
                    const isDeployed = xnodesData.some(item => item.deploymentAuth.toString() == xuId.toString());
                    return (

                      <li
                        key={index}
                        className="flex w-[500px] items-start gap-12 rounded-lg border-2 border-primary/30 p-6 shadow-[0_0.75rem_0.75rem_hsl(0_0_0/0.05)]"
                      >
                        <div>
                          <ul>
                            <li>
                              {' '}
                              <b> Xnode </b>{' '}
                            </li>
                           
                            <li> 12 months CPU </li>
                            <li> 
                              <b> XU ID: {String(xuNfts[index]).substring(0, 6)}... </b>
                            </li>
                          </ul>
                        </div>

                        <div className="flex h-full w-fit flex-col items-center justify-center">
                          <button
                            disabled={isDeployed}
                            className={`inline-flex h-10 min-w-56 items-center justify-center whitespace-nowrap rounded-md border  px-4 text-sm font-medium text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${isDeployed
                                ? 'cursor-not-allowed border-gray-400 text-gray-400'
                                : 'border-primary text-primary hover:bg-primary/10'
                              }`}
                            onClick={() =>
                              push(`${prefix}/templates?nftId=${xuId.toString()}`)
                            }
                          >
                            {isDeployed ? <span className="text-gray-400">Deployed</span> : 'Deploy'}
                          </button>

                          <p className="mt-5">
                            {' '}
                            <a
                              className="text-blue-500 underline"
                              href={`${chain.blockExplorers.default.url}/nft/${XnodeUnitContract.address}/${xuId.toString()}`}
                              target="_blank"
                            >
                              {' '}
                              View on etherscan{' '}
                            </a>{' '}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
          <p>
            {' '}
            View configured nodes on{' '}
            <a
              className="text-blue-500 underline"
              href={prefix + '/deployments'}
            >
              {' '}
              Deployments tab{' '}
            </a>
            .{' '}
          </p>
        </section>
      </div>
    </>
  )
}

export default Dashboard

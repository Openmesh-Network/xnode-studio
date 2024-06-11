'use client'

/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
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

import { Xnode } from '../../types/node'

import { useXuNfts } from 'utils/nft'
import { BaseError, ContractFunctionRevertedError } from 'viem'
import { useWalletClient, usePublicClient } from 'wagmi'
import { XnodeUnitContract } from '@/contracts/XnodeUnit'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [xnodesData, setXnodesData] = useState<Xnode[] | []>([])
  const [xueNfts, setXueNfts] = useState<BigInt[]>(undefined)
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

  const activateNFT = async (selectedNft: BigInt) => {
    if (!selectedNft) {
      alert('No NFT selected.')
      return
    }
    if (!walletClient) {
      alert('WalletClient undefined.')
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
      alert(transactionRequest)
      return
    }
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

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    })

    alert(`Success: ${receipt.transactionHash}`)
  }

  const getData = useCallback(async () => {
    setIsLoading(true)
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
            setXnodesData(response.data)
          }
        })
      } catch (err) {
        toast.error(
          `Error getting the Xnode list: ${err.response.data.message}`
        )
      }
    }

    setIsLoading(false)
  }, [user?.sessionToken, user, account?.isConnected ])

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
  }, [account?.isConnected])

  const commonClasses =
    'pb-[17.5px] whitespace-nowrap font-normal text-[8px] md:pb-[21px] lg:pb-[24.5px] xl:pb-[28px] 2xl:pb-[35px] 2xl:text-[16px] md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px]'

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
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
            (xueNfts && account?.isConnected) && (
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
                            onClick={ () => activateNFT(xueId) }> 
                            Activate Now
                          </button>

                          <p className="mt-5"> <a className="text-blue-500 underline" href={
                            "https://sepolia.etherscan.io/nft/" + XnodeUnitEntitlementContract.address + "/" + xueId.toString()
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
            (xuNfts && account?.isConnected) && (
              <div>
                <div className="text-[10px] font-bold text-[#313131] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
                  Wallet has {xuNfts.length} active { xuNfts.length == 1 ? "Xnode" : "Xnodes" }, with no configuration.
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
                            "https://sepolia.etherscan.io/nft/" + XnodeUnitContract.address + "/" + xuId.toString()
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

          <div className="my-12"/>
          <div className="text-[10px] font-bold text-[#313131] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
            Deployments
          </div>

          {xnodesData ? (
            <div className="border-1 border-solid/20 border-black">
              <ul className="mt-4 flex flex-col items-center gap-8 overflow-y-auto text-black">
                {xnodesData?.map((node: Xnode) => (
                  <li className="flex w-fit max-w-[800px] items-start gap-12 rounded-lg border border-black/20 p-6 shadow-[0_0.75rem_0.75rem_hsl(0_0_0/0.05)]">
                    {/* <p> Your id is: {node.toString()} </p> */}

                    {/* <div> */}
                    {/*   { node.toString() } */}
                    {/* </div> */}

                        <div>
                          <ul>
                            <li> <b> { node.provider } </b> </li>
                            <li> <b> { node.nftId } </b> </li>

                        <li> {node.name} </li>
                        <li> {node.description} </li>
                      </ul>
                    </div>

                    <div>
                      <ul>
                        <li>
                          {' '}
                          <b> {node.createdAt} </b>{' '}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <ul></ul>
                    </div>

                    <div className="align-center flex h-full justify-center">
                      {/* <button className="inline-flex h-9 min-w-56 items-center justify-center whitespace-nowrap rounded-md border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" */}
                      {/*   onClick={ () => alert('ACTIVATING!!!!')}> */}
                      {/*   Manage */}
                      {/* </button> */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <></>
          )}
        </section>
      </div>
    </>
  )
}

export default Dashboard

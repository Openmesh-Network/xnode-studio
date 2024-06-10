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

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [xnodesData, setXnodesData] = useState<Xnode[] | []>([])
  const [xueNfts, setXueNfts] = useState<BigInt[]>(undefined)

  const [user] = useUser()

  const account = useAccount()

  const { push } = useRouter()

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
  }, [])

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

  // if (isLoading) {
  //   return (
  //     <section className="w-[700px] bg-white px-[20px] pb-[50px] pt-[46px] text-black md:w-[840px] lg:w-[980px] xl:w-[1120px] 2xl:w-[1400px]">
  //       <div className="hidden h-60 animate-pulse px-0 pb-12 md:flex">
  //         <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
  //         <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
  //       </div>
  //       <div className="hidden h-60 animate-pulse px-0 pb-12 md:flex">
  //         <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
  //         <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
  //       </div>
  //       <div className="h-60 animate-pulse px-0 pb-12 md:hidden">
  //         <div className="mt-[10px] h-10 w-full animate-pulse bg-[#dfdfdf]"></div>
  //         <div className="mt-[10px] h-10 w-full animate-pulse bg-[#dfdfdf]"></div>
  //         <div className="mt-[20px] h-32 w-full animate-pulse bg-[#dfdfdf]"></div>
  //       </div>
  //     </section>
  //   )
  // }

  return (
    <>
      <div className="m-20 flex-1">
        <section>
          <h1 className="text-4xl font-semibold text-black">Dashboard</h1>
          <div className="my-12" />

          {!account?.isConnected ? (
            <div>
              <p> Connect your wallet to view available Xnodes. </p>
              <w3m-connect-button />
            </div>
          ) : (
            <>
              <w3m-button />
            </>
          )}

          {
            // TODO: Add check with wallet connect here.

            xueNfts && account?.isConnected && (
              <div>
                <div className="text-[10px] font-bold text-[#313131] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
                  Wallet has {xueNfts.length}{' '}
                  {xueNfts.length == 1 ? 'Xnode' : 'Xnodes'} available for
                  activation.
                </div>

                <ul className="mt-4 flex max-h-[calc(100svh-5rem)] flex-col items-center gap-8 overflow-y-auto text-black">
                  {xueNfts.map((node, index) => (
                    <li
                      key={index}
                      className="flex w-fit items-start gap-12 rounded-lg border-2 border-primary/30 p-6 shadow-[0_0.75rem_0.75rem_hsl(0_0_0/0.05)]"
                    >
                      {/* <p> Your id is: {node.toString()} </p> */}

                      {/* <div> */}
                      {/*   { node.toString() } */}
                      {/* </div> */}

                      <div>
                        <ul>
                          <li> 8 vCPU </li>
                          <li> 16GB RAM </li>
                          <li> 320GB SSD </li>
                          <li> 12 months </li>
                        </ul>
                      </div>

                      <div className="my-auto flex h-full w-fit items-center justify-center align-middle">
                        <button
                          className="inline-flex h-10 min-w-56 items-center justify-center whitespace-nowrap rounded-md border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                          onClick={() =>
                            push(prefix + 'templates?nftId=' + node.toString())
                          }
                        >
                          Activate Now
                        </button>
                      </div>

                      <p>
                        <a
                          className="text-blue-500 underline"
                          href={`${chain.blockExplorers.default.url}/nft/${XnodeUnitEntitlementContract.address}/${node}`}
                          target="_blank"
                        >
                          View on etherscan
                        </a>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }

          <div className="my-12" />
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
                        <li>
                          {' '}
                          <b> {node.provider} </b>{' '}
                        </li>

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

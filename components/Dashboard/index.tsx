'use client'

/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getXueNfts } from 'utils/nft'

import 'react-toastify/dist/ReactToastify.css'

import { useRouter } from 'next/navigation'
import axios from 'axios'
import { parseCookies } from 'nookies'
import { SmileySad } from 'phosphor-react'
import { useAccount } from 'wagmi'
import { useUser } from 'hooks/useUser'

import { Xnode } from '../../types/node'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [xnodesData, setXnodesData] = useState<Xnode[] | []>([])
  const [xueNfts, setXueNfts] = useState<BigInt[]>(undefined)

  const user = useUser()

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
            console.log("Got the Xnode data")
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
          if (xueNfts.length != nfts.length) {
            doUpdate = true;
          }

          for (let i = 0; i < xueNfts.length; i++) {
            if (xueNfts[i] != nfts[i]) {
              doUpdate = true
              break
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
      // alert('User has a cookie.')
    }
  }, [ account ])

  const commonClasses =
    'pb-[17.5px] whitespace-nowrap font-normal text-[8px] md:pb-[21px] lg:pb-[24.5px] xl:pb-[28px] 2xl:pb-[35px] 2xl:text-[16px] md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px]'

  const renderTable = () => {
    return (
      <div className="mx-auto flex text-black">
        {/* Table of all the unactivated Xnodes */}
        {xueNfts?.map((node) => (
          <p> Your id is: {node.toString()} </p>
        ))}

        <table className="mx-auto w-full">
          <thead className="">
            <tr>
              <th
                scope="col"
                className="text-left text-[8px] font-bold tracking-wider md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px] 2xl:text-[16px]"
              >
                Deployment summary{' '}
              </th>
              <th
                scope="col"
                className="text-left text-[8px] font-bold tracking-wider md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px] 2xl:text-[16px]"
              >
                Creation Date
              </th>
              <th
                scope="col"
                className="text-left text-[8px] font-bold tracking-wider md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px] 2xl:text-[16px]"
              >
                Average Cost
              </th>
            </tr>
          </thead>
          <div className="mt-[25px]"></div>

          <tbody className="">
            {xnodesData.map((node) => (
              <tr key={node.id}>
                <td className={`${commonClasses}`}>
                  <div>{node.name}</div>
                  <div className="mt-[2px] text-[6px] text-[#8D8D8D] md:text-[7.2px] lg:text-[8.4px] xl:text-[9.6px] 2xl:text-[12px]">
                    {node.description}
                  </div>
                </td>
                <td className={commonClasses}>
                  {new Date(node.createdAt).toLocaleDateString()}
                </td>
                {
                  // XXX: Find an actual good value here?
                }
                <td className={commonClasses}>??? P/m</td>
                <td className="pb-[17.5px] text-[7px] font-medium text-[#0354EC] underline underline-offset-2 md:pb-[21px] md:text-[8.4px] lg:pb-[24.5px] lg:text-[9.8px] xl:pb-[28px] xl:text-[11.2px] 2xl:pb-[35px] 2xl:text-[14px]">
                  {
                  /* <div
                    className=" cursor-pointer "
                    onClick={() => {
                      handleEdit(
                        node.id,
                        JSON.parse(node.consoleNodes),
                        JSON.parse(node.consoleEdges),
                        node.useCase,
                        node.name,
                        node.description,
                        node.type,
                      )
                    }}
                  >
                    Edit
                  </div> */
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  useEffect(() => {
    getData()
  }, [getData, user])

  if (isLoading || !user) {
    return (
      <section className="w-[700px] bg-white px-[20px] pb-[50px] pt-[46px] text-black md:w-[840px] lg:w-[980px] xl:w-[1120px] 2xl:w-[1400px]">
        <div className="hidden h-60 animate-pulse px-0 pb-12 md:flex">
          <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
          <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
        </div>
        <div className="hidden h-60 animate-pulse px-0 pb-12 md:flex">
          <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
          <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
        </div>
        <div className="h-60 animate-pulse px-0 pb-12 md:hidden">
          <div className="mt-[10px] h-10 w-full animate-pulse bg-[#dfdfdf]"></div>
          <div className="mt-[10px] h-10 w-full animate-pulse bg-[#dfdfdf]"></div>
          <div className="mt-[20px] h-32 w-full animate-pulse bg-[#dfdfdf]"></div>
        </div>
      </section>
    )
  }

  // if (xnodesData.length === 0) {
  //   return (
  //     <div>
  //       {
  //         /* TODO: re-enable this or replace with a login prompt
  //         <div className="mb-[100px] mt-[64px] flex items-center justify-center text-black">
  //           <div className="">
  //             <SmileySad size={32} className="mx-auto mb-2" />
  //             <div>No Xnodes found</div>
  //           </div>
  //         </div>
  //       */
  //       }
  //     </div>
  //   )
  // }

  return (
    <>
      <div className="m-20 flex-1">
        <section>
          <h1 className="text-4xl font-semibold text-black">Dashboard</h1>
          <div className="my-12"/>

          {
            (!account?.isConnected) && (
              <div>
                <p> Connect your wallet to view available Xnodes. </p>
                <w3m-connect-button />
              </div>
            )
          }

          {
            // TODO: Add check with wallet connect here.

            (xueNfts && account?.isConnected) && (
              <div>
                <div className="text-[10px] font-bold text-[#313131] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
                  Wallet has {xueNfts.length} { xueNfts.length == 1 ? "Xnode" : "Xnodes" } available for activation.
                </div>

                <ul className="flex mt-4 max-h-[calc(100svh-5rem)] flex-col items-center gap-8 overflow-y-auto text-black">
                  {
                    xueNfts.map((node) => (
                      <li className="flex w-fit items-start gap-12 rounded-lg border-2 border-primary/30 p-6 shadow-[0_0.75rem_0.75rem_hsl(0_0_0/0.05)]">
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

                        <div className="h-full w-fit my-auto flex align-middle items-center justify-center">
                          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary text-primary hover:bg-primary/10 h-10 rounded-md px-4 min-w-56"
                            onClick={ () => alert('ACTIVATING!!!!')}> 
                            Activate Now
                          </button>
                        </div>

                        <p> <a className="underline text-blue-500" href={
                          "https://sepolia.etherscan.io/nft/0x36dcd679652e484786d4b94621b36d61c17f5dac/" + node.toString()
                          }> View on etherscan  </a> </p>
                      </li>
                    ))
                  }
                </ul>
              </div>
            )
          }

          <div className="my-12"/>
          <div className="text-[10px] font-bold text-[#313131] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
            Deployments
          </div>

          {
            xnodesData && (
              <div className="border-1 border-solid/20 border-black">
                <ul className="flex mt-4 max-h-[calc(100svh-5rem)] flex-col items-center gap-8 text-black">
                  {
                    xnodesData?.map((node: Xnode) => (
                      <li className="flex w-fit items-start gap-12 rounded-lg border border-black/20 p-6 shadow-[0_0.75rem_0.75rem_hsl(0_0_0/0.05)]">
                        {/* <p> Your id is: {node.toString()} </p> */}

                        {/* <div> */}
                        {/*   { node.toString() } */}
                        {/* </div> */}

                        <div>
                          <ul>
                            <li> { node.name } </li>
                            <li> { node.description } </li>
                          </ul>
                        </div>
                        <div>
                          <ul>
                            <li> 8 vCPU </li>
                            <li> 16GB RAM </li>
                            <li> 320GB SSD </li>
                            <li> 12 months </li>
                          </ul>
                        </div>

                        <div className="h-full flex align-center justify-center">
                          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary text-primary hover:bg-primary/10 h-10 rounded-md px-4 min-w-56"
                            onClick={ () => alert('ACTIVATING!!!!')}> 
                            Edit
                          </button>
                        </div>

                      </li>
                    ))
                  }
                </ul>
              </div>
            )

          }

        </section>
      </div>
    </>
  )
}

export default Dashboard

'use client'

/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react'

import 'react-toastify/dist/ReactToastify.css'

import { timeSince } from '@/utils/time'
import { useRouter } from 'next/navigation'
import { XnodeUnitContract } from '@/contracts/XnodeUnit'
import { prefix } from '@/utils/prefix'
import axios from 'axios'
import { useUser } from 'hooks/useUser'
import { useXuNfts } from 'utils/nft'
import { BaseError, ContractFunctionRevertedError } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import Signup from '@/components/Signup'

import { Xnode } from '../../types/node'
import { ToastAction } from '../ui/toast'
import { useToast } from '../ui/use-toast'

const Deployments = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [activateWarnOpen, setActivateWarnOpen] = useState<boolean>(false)
  const [waitOpen, setWaitOpen] = useState<boolean>(false)
  const [successOpen, setSuccessOpen] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [xnodesData, setXnodesData] = useState<Xnode[] | []>([])
  const [isSSHPopupOpen, setSSHIsPopupOpen] = useState(false);
  const [sshKey, setSSHKey] = useState<string>('');
  const account = useAccount()

  const [ user, isUserLoading ] = useUser()

  const { push } = useRouter()
  const { toast } = useToast()

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
            console.log(response.data)
            setXnodesData(response.data)
            setIsLoading(false)
          }
        })
      } catch (err) {
        // toast({
        //   title: 'Error getting the Xnode list',
        //   description: err.response.data.message,
        //   variant: 'destructive',
        // })

        console.error("Couldnt get Xnode list: ", err)
        setIsLoading(false)
      }
    }
  }, [user?.sessionToken, user, account?.isConnected])

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    getData()
  }, [ user?.sessionToken, user?.updatedAt, user, isUserLoading ])

  return (
    <>
      <div className="m-20 flex-1">
        <section>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-semibold text-black flex-1">Deployments</h1>
            <Signup />
          </div>
        <div className="my-12" />
          <br />
          { xnodesData ? (
            <div className="border-1 border-solid/20 border-black">
              <ul className="mt-4 flex flex-col items-center gap-8 overflow-y-auto text-black">
                {xnodesData?.sort((a: Xnode, b: Xnode) => { 
                  if (b.createdAt > a.createdAt) 
                    return 1
                  else
                    return -1
                }).map((node: Xnode, index) => (
                  <li key={index} className="flex w-fit max-w-[800px] items-start gap-12 rounded-lg border border-black/20 p-6 shadow-[0_0.75rem_0.75rem_hsl(0_0_0/0.05)]">
                    <div>
                      <ul>
                        <li>
                          {' '}
                          <b> XU ID: {node.deploymentAuth.substring(0, 6)}... </b>{'   '}
                        </li>

                        <li> {node.name} </li>
                      </ul>
                    </div>

                    <div>
                      <ul>
                        <li>
                          <b> Created { timeSince(node.createdAt) } ago </b>{' '}
                        </li>
                      </ul>
                    </div>

                     <div className="align-center flex h-full justify-center">
                       <button
                         className="inline-flex h-9 min-w-56 items-center justify-center whitespace-nowrap rounded-md border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                         onClick={() => push(prefix + '/xnode?uuid=' + node.id)}
                       >
                         Manage
                       </button>
                     </div>
                     <div >
                       Last heard from {timeSince(node.updatedAt) } ago
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

export default Deployments

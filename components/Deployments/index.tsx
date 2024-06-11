'use client'

/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react'

import 'react-toastify/dist/ReactToastify.css'

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
  const account = useAccount()

  const [user] = useUser()

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
        toast({
          title: 'Error getting the Xnode list',
          description: err.response.data.message,
          variant: 'destructive',
        })
        setIsLoading(false)
      }
    }
  }, [user?.sessionToken, user, account?.isConnected])

  const commonClasses =
    'pb-[17.5px] whitespace-nowrap font-normal text-[8px] md:pb-[21px] lg:pb-[24.5px] xl:pb-[28px] 2xl:pb-[35px] 2xl:text-[16px] md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px]'

  useEffect(() => {
    getData()
  }, [ ])

  useEffect(() => {
    getData()
  }, [ user?.sessionToken, user ])

  return (
    <>
      <div className="m-20 flex-1">
        <section>
          <h1 className="text-4xl font-semibold text-black">Deployments</h1>
          <div className="my-12" />

          <Signup />

          { xnodesData ? (
            <div className="border-1 border-solid/20 border-black">
              <ul className="mt-4 flex flex-col items-center gap-8 overflow-y-auto text-black">
                {xnodesData?.map((node: Xnode) => (
                  <li className="flex w-fit max-w-[800px] items-start gap-12 rounded-lg border border-black/20 p-6 shadow-[0_0.75rem_0.75rem_hsl(0_0_0/0.05)]">
                    <div>
                      <ul>
                        <li>
                          {' '}
                          <b> {node.nftId} </b>{' '}
                        </li>

                        <li> {node.name} </li>
                        <li> {node.description} </li>

                        <li>
                          {' '}
                          <b> {node.provider} </b>{' '}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <ul>
                        <li>
                          <b> {node.createdAt} </b>{' '}
                        </li>
                      </ul>
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

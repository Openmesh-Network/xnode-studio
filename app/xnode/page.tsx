'use client'

import { AccountContext } from '@/contexts/AccountContext'
import { z } from 'zod'

/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useUser } from 'hooks/useUser'

import Signup from '@/components/Signup'
import { Xnode } from '../../types/node'

import { useDraft } from '@/hooks/useDraftDeploy'
import Loading from '@/components/Loading'

type XnodePageProps = {
  searchParams: {
    uuid: string
  }
}
export default function XnodePage({ searchParams }: XnodePageProps) {
  const { indexerDeployerStep, setIndexerDeployerStep } = useContext(AccountContext)
  const [ draft, setDraft ] = useDraft()
  const [ isLoading, setIsLoading ] = useState<boolean>(true)
  const [ xnodeData, setXnodeData ] = useState<Xnode | undefined>(undefined)

  const id = z.coerce
    .string()
    .parse(String(searchParams.uuid))

  const [user] = useUser()

  const getData = useCallback(async () => {
    setIsLoading(true)

    if (user?.sessionToken) {
      const config = {
        method: 'post' as 'post',
        url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/getXnode`,
        headers: {
          'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
          'X-Parse-Session-Token': user.sessionToken,
          'Content-Type': 'application/json',
        },
        data: {
          "id": id
        }
      }

      try {
        await axios(config).then(function (response) {
          console.log("Got response: ", response)
          if (response.data) {
            console.log('Got the Xnode data')
            setXnodeData(response.data)
            setIsLoading(false)
          }
        })
      } catch (err) {
        console.log(config)

        toast.error(
          `Error getting the Xnode list: ${err.response.data.message}`
        )
        setIsLoading(false)
      }
    }

  }, [user?.sessionToken, user ])

  useEffect(() => {
    getData()
  }, [user?.sessionToken])

  function getExpirationDays(startDate: Date) {
    let d = new Date(startDate)
    console.error(d.getTime())

    const today = new Date()
    const total = today.getTime() - (d.getTime())

    const days = 365 - (Math.floor((total / 1000 / 60 / 60 / 24) % 1000000))

    return days + " days"
  }


  return (
    <div className="m-20 flex-1">
      <section>
        <div className="flex h-full">
          {
            isLoading && (
              <Loading />
            )
          }

          {
            !isLoading && user?.sessionToken ? (
              <>
                {
                  xnodeData ? (
                    <div>

                      <p> { xnodeData.name } </p>

                      { xnodeData.isUnit && (
                        <p> { getExpirationDays(xnodeData.unitClaimTime) } </p>
                      )
                      }

                    </div>
                  ) : (
                    <>
                      <p> No Xnode for that UUID found. </p>
                    </>
                  )
                }
              </>
            ) : (
              <>
                {
                  !isLoading && (
                    <Signup/>
                  )
                }
              </>
            )
                }
        </div>
      </section>
    </div>
  )
}

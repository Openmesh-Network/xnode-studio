'use client'

/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react'
import { getXueNfts } from "utils/nft";
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import { useRouter } from 'next/navigation'
import { AccountContext } from '@/contexts/AccountContext'
import axios from 'axios'
import { parseCookies } from 'nookies'
import { SmileySad } from 'phosphor-react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAccount } from 'wagmi'

import { Xnode } from '../../types/node'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isViewingMore, setIsViewingMore] = useState<any>('')
  const [xnodesData, setXnodesData] = useState<Xnode[] | []>([])
  const [xueNfts, setXueNfts] = useState<BigInt[]>(undefined)

  const cookies = parseCookies()
  const userHasAnyCookie = cookies.userSessionToken

  const generateFakeData = () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    return months.map((month) => ({
      name: month,
      uptime: Math.floor(Math.random() * 100),
    }))
  }

  const [chartData, setChartData] = useState(generateFakeData())
  const account = useAccount()

  const {
    // selectionSideNavBar,
    // setSelectionSideNavBar,
    // next,
    // setNext,
    // reviewYourBuild,
    // setReviewYourBuild,
    // finalNodes,
    // tagXnode,
    // projectName,
    // setProjectName,
    // setProjectDescription,
    // setSignup,
    // setNextFromScratch,
    // setConnections,
    // setFinalBuild,
    // setTagXnode,
    // setXnodeType,
    // xnodeType,
    user,
  } = useContext(AccountContext)

  const { push } = useRouter()

  function renderURLsXnode(data: string[]) {
    return (
      <div className="grid gap-y-[10px] text-[#0354EC] underline-offset-1 md:gap-y-[12px] lg:gap-y-[14px] xl:gap-y-[16px] xl:text-[12px] 2xl:gap-y-[20px] 2xl:text-[14px]">
        {data.map((url, index) => (
          // eslint-disable-next-line react/jsx-key
          <a href={url} target="_blank" rel="noreferrer">
            <div className="cursor-pointer hover:text-[#031c49]" key={index}>
              {url}
            </div>
          </a>
        ))}
      </div>
    )
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
  }, [user])

  useEffect(() => {
    // XXX: User isn't logged in!
    // This is big problem.
    // Correct behaviour:
    //  - Ask for login to view actual deployments?
    //  - Keep list of pending deployments available.
    if (!account?.address) {
      // setXueNfts([])
    } else {
      const findXueForAccount = async () => {
        let nfts = await getXueNfts(account).catch(console.error)
        if (nfts) {
          setXueNfts(nfts)
          console.log('Got them:')
          console.log(nfts)
        } else {
          console.log('Did not get them')
          console.log(nfts)
        }
      }

      findXueForAccount()
    }

    if (!userHasAnyCookie) {
      push(
        `${process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD' ? `/xnode/` : `/`}`
      )
    }
  }, [user, account, userHasAnyCookie])

  const commonClasses =
    'pb-[17.5px] whitespace-nowrap font-normal text-[8px] md:pb-[21px] lg:pb-[24.5px] xl:pb-[28px] 2xl:pb-[35px] 2xl:text-[16px] md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px]'

  const renderTable = () => {
    return (
      <div className="mx-auto flex text-black">
        {/* Table of all the unactivated Xnodes */}
        {xueNfts?.map((node) => (
          <div className="">
            <p> Your id is: {node.toString()} </p>
          </div>
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
                  {/* <div
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
                  </div> */}
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

  if (xnodesData.length === 0) {
    return (
      <div>
        <div className="mb-[100px] mt-[64px] flex items-center justify-center text-black">
          <div className="">
            <SmileySad size={32} className="mx-auto mb-2" />
            <div>No Xnodes found</div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
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

  return (
    <>
      <div className="mx-auto mb-[100px] w-[750px] rounded-[10px] bg-[#F9F9F9] px-[50px] pb-[70px] pt-[30px] shadow-[1px_1px_6px_0px_rgba(124,124,124,0.20)] md:w-[900px] md:px-[60px] md:pb-[90px] md:pt-[36px] lg:w-[1050px] lg:px-[70px] lg:pb-[110px] lg:pt-[42px] xl:w-[1200px] xl:px-[80px] xl:pb-[144px] xl:pt-[48px] 2xl:w-[1500px] 2xl:px-[100px] 2xl:pb-[155px] 2xl:pt-[60px]">
        <div className="text-[10px] font-bold text-[#313131] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
          Your deployments
        </div>
        <div className="mt-[22.5px] overflow-x-auto md:mt-[27px] lg:mt-[31.5px] xl:mt-[36px] 2xl:mt-[45px]">
          {' '}
          {renderTable()}
        </div>
        <div className="mt-[40px] text-[10px] font-bold text-[#313131] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
          Dashboards to display{' '}
        </div>
        <div className="mt-[50px] hidden md:flex">
          <h2 className="mb-[20px] ml-[50px] text-lg font-semibold text-black">
            Xnode Uptime
          </h2>
          <LineChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="uptime"
              stroke="#0354EC"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>
      </div>
    </>
  )
}

export default Dashboard

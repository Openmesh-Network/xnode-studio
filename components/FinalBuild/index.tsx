/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AccountContext } from '@/contexts/AccountContext'
import axios from 'axios'
import { toast } from 'react-toastify'

import { CoreServices } from '@/types/node'

import CostEstimator from '../CostEstimator'
import Dropdown from '../Dropdown'
import Hero from '../Hero'
import IncludedServices from '../IncludedServices'
import LatencySelector from '../LatencySelector'
import Presets from '../Presets'
import SelectCloudProvider from '../SelectCloudProvider'
import SelectLatencyPreference from '../SelectLatencyPreference'
import SelectServiceRegion from '../SelectServiceRegion'
import SelectUseCase from '../SelectUseCase'
import ServerProvision from '../ServerProvision'
import AddOns from './AddOns'
import AddOns2 from './AddOns2'
import CloudProvider from './CloudProvider'
import ServiceRegion from './ServiceRegion'
import YourCore from './YourCore'

import 'react-toastify/dist/ReactToastify.css'

import {
  optionsFeature,
  optionsServerLocationToValue,
  optionsServerNumberToValue,
} from '@/utils/constants'
import { Timer } from 'phosphor-react'

import { DeploymentConfiguration, ServiceFromName } from '@/types/dataProvider'

export function findServerDefaultType(array) {
  const serverObject = array.find((item) => item.type === 'server')
  return serverObject?.data?.defaultValueServerType || null
}

export function findServerDefaultValueLocation(array) {
  const serverObject = array.find((item) => item.type === 'server')
  return serverObject?.data?.defaultValueLocation || null
}

export function findAPIisWebsocket(array) {
  const apiObject = array.find((item) => item.type === 'api')
  if (apiObject?.data?.name === 'WebSocket API') {
    return true
  } else {
    return false
  }
}

export function findFeatures(array) {
  const dataObject = array.find((item) => item.type === 'dataStreaming')
  const finalFeatures = []
  for (let i = 0; i < dataObject?.data?.lists?.length; i++) {
    if (
      optionsFeature.includes(dataObject?.data?.lists[i]?.title?.toLowerCase())
    ) {
      finalFeatures.push(dataObject?.data?.lists[i]?.title?.toLowerCase())
    }
  }
  return finalFeatures
}

export const coreServicesType = ['utility', 'rpc', 'analytics']
export const nameToDesc = {
  ValidationCloud: 'Enterprise-grade staking and node infrastructure',
  NodeReal: 'One-stop blockchain infrastructure and service provider.',
  Grafana: 'Data Streaming service',
  Prometheus: 'A node service provider, that provides.',
  Ascend:
    "Data Pipeline Automation for building the world's most intelligent data pipelines.",
  Databricks:
    'Combines data warehouses & data lakes into a lakehouse architecture.',
  InfraAdmin: 'One-stop blockchain infrastructure and service provider.',
  'Pythia Pro': 'Data Streaming service',
  Pythia: 'A node service provider, that provides.',
  Snowflake: 'One-stop blockchain infrastructure and service provider.',
}
export const nameToFree = {
  ValidationCloud: false,
  NodeReal: false,
  Grafana: true,
  Prometheus: true,
  Ascend: true,
  Databricks: false,
  InfraAdmin: false,
  'Pythia Pro': true,
  Pythia: true,
  Snowflake: true,
}

/* eslint-disable react/no-unescaped-entities */
const ReviewYourBuild = () => {
  const [cloudProvider, setCloudProvider] = useState<string>()
  const [serviceRegion, setServiceRegion] = useState<string>('US, East')
  const [newXnodeId, setNewXnodeId] = useState<string>()
  const [coreServices, setCoreServices] = useState<CoreServices[]>([])
  const [coreServicesData, setCoreServicesData] = useState<string[]>([])
  const [coreServicesApi, setCoreServicesApi] = useState<string[]>([])
  const [sentRequest, setSentRequest] = useState<boolean>(false)
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [isLoadingFeatures, setIsLoadingFeatures] = useState<boolean>(false)

  const {
    selectionSideNavBar,
    setSelectionSideNavBar,
    next,
    setNext,
    reviewYourBuild,
    setReviewYourBuild,
    finalNodes,
    tagXnode,
    user,
    projectName,
    setProjectName,
    setSignup,
    xnodeType,
    draft,
  } = useContext(AccountContext)

  const { push } = useRouter()

  const createXnode = useCallback(
    async (config: DeploymentConfiguration) => {
      setIsDeploying(true)

      const payload = {
        name: config.name,
        location: config.location,
        description: config.desc,
        provider: config.provider,
        isUnit: config.isUnit,
        services: JSON.stringify(config.services),
      }

      console.log('Payload: ')
      console.log(payload)

      if (user.sessionToken) {
        const config = {
          method: 'post' as 'post',
          url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/createXnode`,
          headers: {
            'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
            'X-Parse-Session-Token': user.sessionToken,
            'Content-Type': 'application/json',
          },
          data: payload,
        }

        try {
          await axios(config).then(function (response) {
            if (response.data) {
              setIsLoadingFeatures(true)
              setNewXnodeId(response.data.id)
            }
          })
        } catch (err) {
          toast.error(
            `Error during Xnode deployment: ${err.response.data.message}`
          )
        }
      } else {
        push(
          `${process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD' ? `/xnode/` : `/`}`
        )
      }
    },
    [push, user.sessionToken]
  )

  useEffect(() => {
    // let draft = localStorage.getItem('draft')

    // {
    //   // XXX: This is just here for testing purposes.
    //   let config: DeploymentConfiguration = {
    //     name: "My Minecraft Server",
    //     desc: "This is my favourite videogame, so I'm running it on my Xnode!",
    //     location: "ny",
    //     provider: "Unit",
    //     isUnit: true,
    //     services: [ ServiceFromName("Minecraft") ]
    //   }
    //   draft = JSON.stringify(config)
    // }

    // XXX: This runs twice for some reason!!
    //  - Some nextjs config that runs all effects twice.
    //  - Maybe component is included/rendered twice?

    console.log('Effect has been run')
    console.log(draft)
    if (draft && !sentRequest) {
      console.log('Draft exists! Creating Xnode.', sentRequest)
      createXnode(draft)
    }
  }, [createXnode, draft, sentRequest])

  if (!isDeploying) {
    return (
      <section
        id="home"
        className={`mx-auto w-full px-[30px] pb-[200px] pt-[25px] md:px-[36px] md:pt-[30px] lg:px-[42px] lg:pt-[35px] xl:px-[48px] xl:pt-[40px] 2xl:px-[60px] 2xl:pt-[50px]`}
      >
        {' '}
        <div className="mx-auto size-[200px] animate-spin rounded-full border-b-2 border-[#0354EC]"></div>
      </section>
    )
  }

  return (
    <>
      <section
        id="home"
        className={`w-full px-[30px] pb-[100px] pt-[25px] md:px-[36px] md:pt-[30px] lg:px-[42px] lg:pt-[35px] xl:px-[48px] xl:pt-[40px] 2xl:px-[60px] 2xl:pt-[50px]`}
      >
        <div>
          <div className="text-[18px] font-bold tracking-[-2%] text-black md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:text-[32px]">
            Your progress
          </div>
          <div className="mt-[25px] text-[18px] font-normal tracking-[-2%] text-[#C8C8C8] md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:mt-[32px] 2xl:text-[32px]">
            {/* XXX: Incorrect! */}
            Estimate time to deployment ~ 31 min
          </div>
          <div className="mt-[15px] grid gap-y-[10px] md:mt-[18px] md:gap-y-[12px] lg:mt-[21px] lg:gap-y-[14px] 2xl:mt-[30px] 2xl:gap-y-[20px]">
            <CloudProvider
              onValueChange={() => setReviewYourBuild(false)}
              cloudProvider={cloudProvider}
            />
            <ServiceRegion
              onValueChange={() => setReviewYourBuild(false)}
              serviceRegion={serviceRegion}
            />
            <YourCore
              coreServices={coreServices}
              coreServicesApi={coreServicesApi}
              coreServicesData={coreServicesData}
              isLoadingFeatures={isLoadingFeatures}
              xnodeType={xnodeType}
              xnodeId={newXnodeId}
              onValueChange={() => setReviewYourBuild(false)}
            />
            <AddOns2
              coreServices={coreServices}
              onValueChange={() => setReviewYourBuild(false)}
              isLoadingFeatures={isLoadingFeatures}
            />
            {/* <AddOns onValueChange={() => setReviewYourBuild(false)} /> */}
          </div>
        </div>
      </section>
    </>
  )
}

export default ReviewYourBuild

/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from 'react'
import Dropdown from '../Dropdown'
import LatencySelector from '../LatencySelector'
import Presets from '../Presets'
import CostEstimator from '../CostEstimator'
import ServerProvision from '../ServerProvision'
import IncludedServices from '../IncludedServices'
import AddOns from './AddOns'
import SelectCloudProvider from '../SelectCloudProvider'
import SelectServiceRegion from '../SelectServiceRegion'
import SelectLatencyPreference from '../SelectLatencyPreference'
import SelectUseCase from '../SelectUseCase'
import Hero from '../Hero'
import { useRouter } from 'next/navigation'
import CloudProvider from './CloudProvider'
import { AccountContext } from '@/contexts/AccountContext'
import ServiceRegion from './ServiceRegion'
import YourCore from './YourCore'
import { CoreServices } from '@/types/node'
import AddOns2 from './AddOns2'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  optionsFeature,
  optionsServerLocationToValue,
  optionsServerNumberToValue,
} from '@/utils/constants'

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
    // eslint-disable-next-line prettier/prettier
    if (optionsFeature.includes(dataObject?.data?.lists[i]?.title?.toLowerCase())) {
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
  } = useContext(AccountContext)

  const { push } = useRouter()

  async function createXnode() {
    setIsDeploying(true)
    const savedNodes = localStorage.getItem('nodes')
    const savedEdges = localStorage.getItem('edges')

    const serverLoc =
      optionsServerLocationToValue[
        findServerDefaultValueLocation(JSON.parse(savedNodes))
      ]
    const serverNumber =
      optionsServerNumberToValue[findServerDefaultType(JSON.parse(savedNodes))]

    const features = findFeatures(JSON.parse(savedNodes))

    const websocketEnabled = findAPIisWebsocket(JSON.parse(savedNodes))
    const finalData = {
      name: projectName,
      description: 'This is my xnode',
      useCase: tagXnode,
      status: 'Running',
      location: findServerDefaultValueLocation(JSON.parse(savedNodes)),
      consoleNodes: savedNodes,
      consoleEdges: savedEdges,
      type: xnodeType,
      serverLoc,
      serverNumber,
      websocketEnabled,
      features,
    }
    console.log('final data aq')
    console.log(finalData)

    if (user.sessionToken) {
      const config = {
        method: 'post' as 'post',
        url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/createXnode`,
        headers: {
          'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
          'X-Parse-Session-Token': user.sessionToken,
          'Content-Type': 'application/json',
        },
        data: finalData,
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
          `Error during Xnode deployment: ${err.response.data.message}`,
        )
      }
    } else {
      push(
        `${
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
            ? `/xnode/start-here`
            : `/start-here`
        }`,
      )
    }
    // setIsDeploying(false)
  }

  useEffect(() => {
    const savedNodes = localStorage.getItem('nodes')

    if (savedNodes) {
      const final = JSON.parse(savedNodes)
      // Setting the server flow
      const existingServerIndex = final.findIndex(
        (node) => node.type === 'server',
      )
      console.log(existingServerIndex)
      if (existingServerIndex !== -1) {
        setServiceRegion(final[existingServerIndex].data.defaultValueLocation)
        setCloudProvider(
          final[existingServerIndex].data.defaultValueCloudProvider,
        )
      }

      // Setting the core services flow
      const coreServicesArray = []
      const coreServiceDataArray = []
      const coreServiceApiArray = []

      for (let i = 0; i < final.length; i++) {
        const node = final[i]

        if (coreServicesType.includes(node.type)) {
          console.log(node.data)
          coreServicesArray.push({
            name: node.data.name,
            description: nameToDesc[node.data.name] || '',
            isFree: nameToFree[node.data.name] || false,
          })
        } else if (node.type === 'dataStreaming') {
          for (let j = 0; j < node.data?.lists.length; j++) {
            if (node.data.lists[j].title !== 'dataOption.title') {
              coreServiceDataArray.push(node.data.lists[j].title)
            }
          }
        } else if (node.type === 'dataHistorical') {
          for (let j = 0; j < node.data?.lists.length; j++) {
            if (node.data.lists[j].title !== 'dataOption.title') {
              coreServiceDataArray.push(node.data.lists[j].title)
            }
          }
        } else if (node.type === 'api') {
          coreServiceApiArray.push(node.data.name)
        }
      }
      setCoreServices(coreServicesArray)
      setCoreServicesData(coreServiceDataArray)
      setCoreServicesApi(coreServiceApiArray)

      console.log(coreServicesArray)
      console.log(coreServiceDataArray)
      console.log(coreServiceApiArray)
      createXnode()
    }
  }, [])

  if (!isDeploying) {
    return (
      <section
        id="home"
        className={`mx-auto w-full  px-[30px] pb-[200px] pt-[25px] md:px-[36px] md:pt-[30px] lg:px-[42px] lg:pt-[35px] xl:px-[48px] xl:pt-[40px] 2xl:px-[60px] 2xl:pt-[50px]`}
      >
        {' '}
        <div className="mx-auto h-[200px] w-[200px] animate-spin rounded-full  border-b-2 border-[#0354EC]"></div>
      </section>
    )
  }

  return (
    <>
      <section
        id="home"
        className={`w-full  px-[30px] pb-[100px] pt-[25px] md:px-[36px] md:pt-[30px] lg:px-[42px] lg:pt-[35px] xl:px-[48px] xl:pt-[40px] 2xl:px-[60px] 2xl:pt-[50px]`}
      >
        <div>
          <div className="text-[18px]  font-bold -tracking-[2%] text-[#000000] md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:text-[32px]">
            Your progress
          </div>
          <div className="mt-[25px] text-[18px] font-normal -tracking-[2%] text-[#C8C8C8] md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:mt-[32px] 2xl:text-[32px]">
            Estimate time to deployment ~ 31 min
          </div>
          <div className="mt-[15px] grid gap-y-[10px] md:mt-[18px] md:gap-y-[12px] lg:mt-[21px] lg:gap-y-[14px]  2xl:mt-[30px] 2xl:gap-y-[20px]">
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

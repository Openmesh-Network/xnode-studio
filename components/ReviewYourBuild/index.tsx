// /* eslint-disable no-unused-vars */
// import { useEffect, useState, useContext } from 'react'
// import Dropdown from '../Dropdown'
// import LatencySelector from '../LatencySelector'
// import Presets from '../Presets'
// import CostEstimator from '../CostEstimator'
// import ServerProvision from '../ServerProvision'
// import IncludedServices from '../IncludedServices'
// import AddOns from './AddOns'
// import SelectCloudProvider from '../SelectCloudProvider'
// import SelectServiceRegion from '../SelectServiceRegion'
// import SelectLatencyPreference from '../SelectLatencyPreference'
// import SelectUseCase from '../SelectUseCase'
// import Hero from '../Hero'
// import { useRouter } from 'next/navigation'
// import CloudProvider from './CloudProvider'
// import { AccountContext } from '@/contexts/AccountContext'
// import ServiceRegion from './ServiceRegion'
// import YourCore from './YourCore'
// import { CoreServices } from '@/types/node'
// import AddOns2 from './AddOns2'

// /* eslint-disable react/no-unescaped-entities */
// const ReviewYourBuild = () => {
//   const [cloudProvider, setCloudProvider] = useState<string>()
//   const [serviceRegion, setServiceRegion] = useState<string>()
//   const [coreServices, setCoreServices] = useState<CoreServices[]>([])
//   const [coreServicesData, setCoreServicesData] = useState<string[]>([])
//   const [coreServicesApi, setCoreServicesApi] = useState<string[]>([])

//   const {
//     selectionSideNavBar,
//     setSelectionSideNavBar,
//     next,
//     setNext,
//     reviewYourBuild,
//     setReviewYourBuild,
//     finalNodes,
//     setSignup,
//   } = useContext(AccountContext)

//   const coreServicesType = ['utility', 'rpc', 'analytics']
//   const nameToDesc = {
//     ValidationCloud: 'Enterprise-grade staking and node infrastructure',
//     NodeReal: 'One-stop blockchain infrastructure and service provider.',
//     Grafana: 'Data Streaming service',
//     Prometheus: 'A node service provider, that provides.',
//     Ascend:
//       "Data Pipeline Automation for building the world's most intelligent data pipelines.",
//     Databricks:
//       'Combines data warehouses & data lakes into a lakehouse architecture.',
//     InfraAdmin: 'One-stop blockchain infrastructure and service provider.',
//     'Pythia Pro': 'Data Streaming service',
//     Pythia: 'A node service provider, that provides.',
//     Snowflake: 'One-stop blockchain infrastructure and service provider.',
//   }
//   const nameToFree = {
//     ValidationCloud: false,
//     NodeReal: false,
//     Grafana: true,
//     Prometheus: true,
//     Ascend: true,
//     Databricks: false,
//     InfraAdmin: false,
//     'Pythia Pro': true,
//     Pythia: true,
//     Snowflake: true,
//   }

//   const { push } = useRouter()

//   useEffect(() => {
//     console.log(finalNodes)
//     const savedNodes = localStorage.getItem('nodes')

//     if (finalNodes) {
//       // Setting the server flow
//       const existingServerIndex = finalNodes.findIndex(
//         (node) => node.type === 'server',
//       )
//       console.log(existingServerIndex)
//       if (existingServerIndex !== -1) {
//         setServiceRegion(
//           finalNodes[existingServerIndex].data.defaultValueLocation,
//         )
//         setCloudProvider(
//           finalNodes[existingServerIndex].data.defaultValueCloudProvider,
//         )
//       }

//       // Setting the core services flow
//       const coreServicesArray = []
//       const coreServiceDataArray = []
//       const coreServiceApiArray = []

//       for (let i = 0; i < finalNodes.length; i++) {
//         const node = finalNodes[i]

//         if (coreServicesType.includes(node.type)) {
//           console.log(node.data)
//           coreServicesArray.push({
//             name: node.data.name,
//             description: nameToDesc[node.data.name] || '',
//             isFree: nameToFree[node.data.name] || false,
//           })
//         } else if (node.type === 'dataStreaming') {
//           for (let j = 0; j < node.data?.lists.length; j++) {
//             if (node.data.lists[j].title !== 'dataOption.title') {
//               coreServiceDataArray.push(node.data.lists[j].title)
//             }
//           }
//         } else if (node.type === 'dataHistorical') {
//           for (let j = 0; j < node.data?.lists.length; j++) {
//             if (node.data.lists[j].title !== 'dataOption.title') {
//               coreServiceDataArray.push(node.data.lists[j].title)
//             }
//           }
//         } else if (node.type === 'api') {
//           coreServiceApiArray.push(node.data.name)
//         }
//       }

//       setCoreServices(coreServicesArray)
//       setCoreServicesData(coreServiceDataArray)
//       setCoreServicesApi(coreServiceApiArray)

//       console.log(coreServicesArray)
//       console.log(coreServiceDataArray)
//       console.log(coreServiceApiArray)
//     }

//     if (savedNodes) {
//       const final = JSON.parse(savedNodes)
//       // Setting the server flow
//       const existingServerIndex = final.findIndex(
//         (node) => node.type === 'server',
//       )
//       console.log(existingServerIndex)
//       if (existingServerIndex !== -1) {
//         setServiceRegion(final[existingServerIndex].data.defaultValueLocation)
//         setCloudProvider(
//           final[existingServerIndex].data.defaultValueCloudProvider,
//         )
//       }

//       // Setting the core services flow
//       const coreServicesArray = []
//       const coreServiceDataArray = []
//       const coreServiceApiArray = []

//       for (let i = 0; i < final.length; i++) {
//         const node = final[i]

//         if (coreServicesType.includes(node.type)) {
//           console.log(node.data)
//           coreServicesArray.push({
//             name: node.data.name,
//             description: nameToDesc[node.data.name] || '',
//             isFree: nameToFree[node.data.name] || false,
//           })
//         } else if (node.type === 'dataStreaming') {
//           for (let j = 0; j < node.data?.lists.length; j++) {
//             if (node.data.lists[j].title !== 'dataOption.title') {
//               coreServiceDataArray.push(node.data.lists[j].title)
//             }
//           }
//         } else if (node.type === 'dataHistorical') {
//           for (let j = 0; j < node.data?.lists.length; j++) {
//             if (node.data.lists[j].title !== 'dataOption.title') {
//               coreServiceDataArray.push(node.data.lists[j].title)
//             }
//           }
//         } else if (node.type === 'api') {
//           coreServiceApiArray.push(node.data.name)
//         }
//       }
//       setCoreServices(coreServicesArray)
//       setCoreServicesData(coreServiceDataArray)
//       setCoreServicesApi(coreServiceApiArray)

//       console.log(coreServicesArray)
//       console.log(coreServiceDataArray)
//       console.log(coreServiceApiArray)
//     }
//   }, [])

//   return (
//     <>
//       <section
//         id="home"
//         className={`w-full px-[30px] pb-[100px] pt-[25px] md:px-[36px] md:pt-[30px] lg:px-[42px] lg:pt-[35px] xl:px-[48px] xl:pt-[40px] 2xl:px-[60px] 2xl:pt-[50px]`}
//       >
//         <div>
//           <div className="text-[18px]  font-bold -tracking-[2%] text-[#000000] md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:text-[32px]">
//             Review your build
//           </div>
//           <div className="mt-[25px] text-[18px] font-normal -tracking-[2%] text-[#C8C8C8] md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:mt-[32px] 2xl:text-[32px]">
//             Finalise your integrations easy
//           </div>
//           <div className="mt-[15px] grid gap-y-[10px] md:mt-[18px] md:gap-y-[12px] lg:mt-[21px] lg:gap-y-[14px]  2xl:mt-[30px] 2xl:gap-y-[20px]">
//             <CloudProvider
//               onValueChange={() => setReviewYourBuild(false)}
//               cloudProvider={cloudProvider}
//             />
//             <ServiceRegion
//               onValueChange={() => setReviewYourBuild(false)}
//               serviceRegion={serviceRegion}
//             />
//             <YourCore
//               coreServices={coreServices}
//               coreServicesApi={coreServicesApi}
//               coreServicesData={coreServicesData}
//               onValueChange={() => setReviewYourBuild(false)}
//             />
//             {}
//             <AddOns2
//               coreServices={coreServices}
//               onValueChange={() => setReviewYourBuild(false)}
//             />
//             {/* <AddOns onValueChange={() => setReviewYourBuild(false)} /> */}
//           </div>
//           <div className="flex gap-x-[25px]">
//             <div
//               onClick={() => {
//                 window.scrollTo({ top: 0, behavior: 'smooth' })
//                 setSignup(false)
//                 setReviewYourBuild(false)
//                 push(
//                   `${
//                     process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
//                       ? `/xnode/workspace`
//                       : `/workspace`
//                   }`,
//                 )
//               }}
//               className="mt-[41px] flex h-fit w-fit cursor-pointer justify-center gap-x-[8px] rounded-[5px] bg-[#787d86] py-[6.2px] px-[11px] text-center text-[7px] font-medium text-white hover:bg-[#5d6066] md:mt-[49px] md:py-[7.5px] md:px-[12.5px] md:text-[8.4px] lg:mt-[57px] lg:py-[8.75px]  lg:px-[14.5px] lg:text-[10px]   xl:mt-[65px] xl:py-[10px]    xl:px-[17px]  xl:text-[11.2px]  2xl:mt-[82px] 2xl:gap-x-[10px]  2xl:py-[12.5px] 2xl:px-[21px] 2xl:text-[14px]"
//             >
//               <img
//                 src={`${
//                   process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
//                     ? process.env.NEXT_PUBLIC_BASE_PATH
//                     : ''
//                 }/images/header/arrow-left-new.svg`}
//                 alt="image"
//                 className={`w-[5px] md:w-[6px] lg:w-[7px] xl:w-[8px] 2xl:w-[12px]`}
//               />
//               <div>Back</div>
//             </div>
//             <div
//               onClick={() => {
//                 window.scrollTo({ top: 0, behavior: 'smooth' })
//                 setSignup(true)
//               }}
//               className="mt-[41px] flex h-fit w-fit cursor-pointer justify-center gap-x-[8px] rounded-[5px] bg-[#0354EC] py-[6.2px] px-[11px] text-center text-[7px] font-medium text-white hover:bg-[#0e2e69] md:mt-[49px] md:py-[7.5px] md:px-[12.5px] md:text-[8.4px] lg:mt-[57px] lg:py-[8.75px]  lg:px-[14.5px] lg:text-[10px]   xl:mt-[65px] xl:py-[10px]    xl:px-[17px]  xl:text-[11.2px]  2xl:mt-[82px] 2xl:gap-x-[10px]  2xl:py-[12.5px] 2xl:px-[21px] 2xl:text-[14px]"
//             >
//               <img
//                 src={`${
//                   process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
//                     ? process.env.NEXT_PUBLIC_BASE_PATH
//                     : ''
//                 }/images/header/storm.svg`}
//                 alt="image"
//                 className={`w-[5px] md:w-[6px] lg:w-[7px] xl:w-[8px] 2xl:w-[10px]`}
//               />
//               <div>Next</div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   )
// }

// export default ReviewYourBuild

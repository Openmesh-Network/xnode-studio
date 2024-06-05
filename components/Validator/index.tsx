'use client'

// import { useState } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-quill/dist/quill.snow.css' // import styles
import 'react-toastify/dist/ReactToastify.css'
import 'prismjs/themes/prism.css'

import { getXnodeWithNodesValidatorsStats } from '@/utils/xnode'

import { XnodeWithValidatorsStats } from '@/types/node'

import Congratulations from './Congratulations'
import Node from './Node'
import Stats from './Stats'

const Validator = (id: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [nextCongrats, setNextCongrats] = useState<boolean>(false)
  const [data, setData] = useState<XnodeWithValidatorsStats>()

  const { push } = useRouter()

  const searchParams = useSearchParams()
  const newDeploy = searchParams.get('newDeploy')

  async function getData(id: any) {
    try {
      const res = await getXnodeWithNodesValidatorsStats(id)
      setData(res)
      console.log(res)
    } catch (err) {
      toast.error(`An error occurred`)
      //   push('/community')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    if (id) {
      getData(id.id)
    } else {
      push('/')
      push(
        `${process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD' ? `/xnode/` : `/`}`
      )
    }
  }, [id, push])

  // const MapChart = () => (
  //   <div className="mx-auto h-[500px] max-w-[300px] lg:max-w-[800px] xl:max-w-[1000px] 2xl:max-w-[1200px]">
  //     <div className="-ml-[12px] mt-[30px] text-[10px] text-black md:mt-[36px] md:text-[12px] lg:mt-[42px] lg:text-[14px] xl:mb-[48px] xl:text-[16px] 2xl:-ml-[15px] 2xl:mb-[60px] 2xl:text-[20px]">
  //       Map of active validators
  //     </div>
  //     <VectorMap
  //       map={worldMill}
  //       backgroundColor="#d3e2ff"
  //       markers={missingCountries}
  //       markerStyle={{
  //         initial: {
  //           fill: 'red',
  //         },
  //       }}
  //       series={{
  //         regions: [
  //           {
  //             scale: colorScale,
  //             values: countries,
  //             attribute: 'fill', // Adicione esta linha
  //           },
  //         ],
  //       }}
  //       onRegionTipShow={function reginalTip(event, label: any, code) {
  //         // Verifica se o país tem uma contagem de Xnodes e atualiza o texto do tooltip
  //         if (countries[code]) {
  //           label.html(`${label.html()}<br>Xnodes: ${countries[code]}`)
  //         }
  //       }}
  //       onMarkerTipShow={function markerTip(event, label, code) {}}
  //     />
  //   </div>
  // )

  if (isLoading) {
    return (
      <section className="px-[30px] pb-[50px] pt-[46px] text-black md:pl-[90px] md:pr-[130px] lg:min-w-[800px] xl:min-w-[1200px] 2xl:min-w-[1200px]">
        <div className="container hidden h-60 animate-pulse px-0 pb-12 md:flex">
          <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
          <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
        </div>
        <div className="container h-60 animate-pulse px-0 pb-12 md:hidden">
          <div className="mt-[10px] h-10 w-full animate-pulse bg-[#dfdfdf]"></div>
          <div className="mt-[10px] h-10 w-full animate-pulse bg-[#dfdfdf]"></div>
          <div className="mt-[20px] h-32 w-full animate-pulse bg-[#dfdfdf]"></div>
        </div>
      </section>
    )
  }

  if (newDeploy === 'true' && data && !nextCongrats) {
    return (
      <section className="mx-auto w-full rounded-[10px] bg-[#F9F9F9] px-[20px] pb-[150px] pt-[78px] md:pb-[180px] md:pt-[93px] lg:pb-[210px] lg:pt-[109px] xl:w-[1379px] xl:pb-[240px] xl:pt-[124px] 2xl:w-[1724px] 2xl:pb-[300px] 2xl:pt-[155px]">
        {' '}
        <Congratulations
          createdAt={data.node.createdAt}
          nodeId={data.node.id}
          onValueChange={() => {
            setNextCongrats(true)
          }}
        />
        <div className="mt-[130px] md:mt-[156px] lg:mt-[182px] xl:mt-[208px] 2xl:mt-[260px]">
          <Stats
            averagePayoutPeriod={data.stats.averagePayoutPeriod}
            nodes={data.nodes}
            totalAverageReward={data.stats.totalAverageReward}
            totalStakeAmount={data.stats.totalStakeAmount}
            totalValidators={data.stats.totalValidators}
          />
        </div>
      </section>
    )
  }

  if (data) {
    return (
      <section className="mx-auto mb-[100px] w-full rounded-[10px] bg-[#F9F9F9] px-[20px] py-[50px] md:pb-[100px] md:pt-[93px] lg:pb-[120px] lg:pt-[109px] xl:w-[1379px] xl:pb-[140px] xl:pt-[124px] 2xl:w-[1724px] 2xl:py-[155px]">
        {' '}
        <Node
          averagePayoutPeriod={data.stats.averagePayoutPeriod}
          nodes={data.nodes}
          totalAverageReward={data.stats.totalAverageReward}
          totalStakeAmount={data.stats.totalStakeAmount}
          totalValidators={data.stats.totalValidators}
          node={data.node}
        />
        <div className="mt-[130px] md:mt-[156px] lg:mt-[182px] xl:mt-[208px] 2xl:mt-[260px]">
          <Stats
            averagePayoutPeriod={data.stats.averagePayoutPeriod}
            nodes={data.nodes}
            totalAverageReward={data.stats.totalAverageReward}
            totalStakeAmount={data.stats.totalStakeAmount}
            totalValidators={data.stats.totalValidators}
          />
        </div>
        {/* <div className="mt-[15px] md:mt-[25px] lg:mt-[50px] xl:mt-[90px] 2xl:mt-[150px]">
          <MapChart />
        </div> */}
      </section>
    )
  }
}

export default Validator

/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { prefix } from '@/utils/prefix'

import AddOns from '../AddOns'
import CostEstimator from '../CostEstimator'
import Hero from '../Hero'
import IncludedServices from '../IncludedServices'
import Presets from '../Presets'
import SelectCloudProvider from '../SelectCloudProvider'
import SelectLatencyPreference from '../SelectLatencyPreference'
import SelectServiceRegion from '../SelectServiceRegion'
import SelectUseCase from '../SelectUseCase'

/* eslint-disable react/no-unescaped-entities */
const FirstStep = () => {
  const [cloudProvider, setCloudProvider] = useState<string>('Equinix')
  const [serviceRegion, setServiceRegion] = useState<string>('US East (Boston)')
  const [latencyPreference, setLatencyPreference] = useState<string>('Low')
  const [preset, setPreset] = useState<number>(0)
  const [includedServices, setIncludedServices] = useState([
    'Kubernetes',
    'Openmesh Consensus',
    'BitTorrent Protocol Client',
    'Phytia Pro',
    'APIs & Connectivity',
  ])
  const [addOnsServices, setAddOnsServices] = useState([])
  const [serversNumber, setServersNumber] = useState<number>(2)
  const [serversType, setServersType] = useState<string>('small')

  const [next, setNext] = useState<Boolean>(false)

  const handleServiceRegionChange = (newValue) => {
    setServiceRegion(newValue)
  }

  const handleLatencyPreferenceChange = (newValue) => {
    setLatencyPreference(newValue)
  }

  const handleServersTypeChange = (newValue) => {
    setServersType(newValue)
  }

  const handleServersNumberChange = (newValue) => {
    setServersNumber(newValue)
  }

  const handleIncludedServersChange = (newValue) => {
    if (includedServices.includes(newValue)) {
      // Se o valor já existe, remova-o do array
      setIncludedServices((prevServices) =>
        prevServices.filter((service) => service !== newValue)
      )
    } else {
      // Se o valor não existe, adicione-o ao array
      setIncludedServices((prevServices) => [...prevServices, newValue])
    }
  }

  const handleObservabilityServicesChange = (newValue) => {
    if (addOnsServices.includes(newValue)) {
      // Se o valor já existe, remova-o do array
      setAddOnsServices((prevServices) =>
        prevServices.filter((service) => service !== newValue)
      )
    } else {
      // Se o valor não existe, adicione-o ao array
      setAddOnsServices((prevServices) => [...prevServices, newValue])
    }
  }

  const renderSecondStepComponent = () => {
    // switch (preset) {
    //   case 0:
    //     return <Component1 />
    //   case 1:
    //     return <Component2 />
    //   case 2:
    //     return <Component3 />
    //   case 3:
    //     return <Component4 />
    //   case 4:
    //     return <Component5 />
    //   default:
    //     return null
    // }
  }
  const { push } = useRouter()

  useEffect(() => {
    // push('/console')
  }, [])

  return (
    <>
      {!next && <Hero />}
      <div className="flex">
        <section
          id="home"
          className={`w-full px-[30px] pb-[52px] pt-[25px] text-black md:pl-[70px] ${
            next
              ? 'px-[30px]'
              : 'md:pr-[288px] lg:pr-[336px] xl:pr-[384px] 2xl:pr-[480px]'
          } md:pb-[63px] md:pt-[31px] lg:pb-[72px] lg:pl-[154px] lg:pt-[36px] xl:pb-[83px] xl:pl-[176px] xl:pt-[41px] 2xl:pb-[104px] 2xl:pl-[220px] 2xl:pt-[52px]`}
        >
          <div className="">
            <div>
              <div className="text-[18px] font-medium tracking-[-2%] text-[#959595] md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:text-[32px]">
                Choose your configuration
              </div>
              <div className="mt-[15px] grid gap-y-[10px] md:mt-[18px] md:gap-y-[12px] lg:mt-[21px] lg:gap-y-[14px] 2xl:mt-[30px] 2xl:gap-y-[20px]">
                <SelectCloudProvider
                  onValueChange={setCloudProvider}
                  next={next}
                />
                <SelectServiceRegion
                  onValueChange={handleServiceRegionChange}
                  next={next}
                />
                <SelectLatencyPreference
                  onValueChange={handleLatencyPreferenceChange}
                  next={next}
                />
                {next ? (
                  <>
                    <div className="grid gap-y-0">
                      <div>
                        {
                          <>
                            {/* <ServerProvision
                              onChangeServerType={handleServersTypeChange}
                              onChangeServerNumber={handleServersNumberChange}
                              serversNumber={serversNumber}
                              serverType={serversType}
                            /> */}
                            <SelectUseCase
                              next={next}
                              presetValueFromParent={preset}
                              onValueChange={(value) => {
                                setPreset(value)
                              }}
                            />
                          </>
                        }
                      </div>
                      <div className="mt-[37px] w-full border-b text-[#D4D4D4] md:mt-[44px] lg:mt-[51px] 2xl:mt-[74px]"></div>

                      <div className="mt-[26px] md:mt-[31px] lg:mt-[36px] 2xl:mt-[52px]">
                        {
                          <IncludedServices
                            onChangeIncludedService={
                              handleIncludedServersChange
                            }
                            includedServicesArray={includedServices}
                          />
                        }
                      </div>
                      <div className="mt-[37px] w-full border-b text-[#D4D4D4] md:mt-[44px] lg:mt-[51px] 2xl:mt-[74px]"></div>
                      <div className="mt-[15px] md:mt-[18px] lg:mt-[21px] 2xl:mt-[30px]">
                        {
                          <AddOns
                            onChangeIncludedAddOns={
                              handleObservabilityServicesChange
                            }
                            includedAddOnsArray={addOnsServices}
                          />
                        }
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="mt-[31px] md:mt-[37px] lg:mt-[43px] 2xl:mt-[62px]">
                      <Presets
                        onValueChange={(value) => {
                          setPreset(value)
                        }}
                      />
                    </div>
                    <div>
                      <div
                        onClick={() => {
                          setNext(true)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="mx-auto mt-[12px] flex w-fit cursor-pointer gap-x-[10px] rounded-[5px] bg-[#0354EC] px-[11px] py-[6.25px] text-[7px] font-medium text-white hover:bg-[#123981] md:mt-[39px] md:px-[12.5px] md:py-[5px] md:text-[8.5px] lg:mt-[45.5px] lg:px-[14.5px] lg:py-[9px] lg:text-[10px] lg:!leading-[19px] xl:px-[17px] xl:py-[10px] xl:text-[11px] 2xl:mt-[65px] 2xl:px-[21px] 2xl:py-[12.5px] 2xl:text-[14px]"
                      >
                        <div>Next</div>
                        <img
                          src={`${prefix}/images/dataset/arrow.svg`}
                          alt="image"
                          className="my-auto h-[7.5px] w-[8px] md:h-[9px] md:w-[9.4px] lg:h-[10.5px] lg:w-[11px] xl:h-[12px] xl:w-[12.3px] 2xl:h-[15px] 2xl:w-[15.4px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {next && (
          <div className="relative mr-[56px] min-w-[200px] md:min-w-[240px] lg:min-w-[280px] xl:min-w-[320px] 2xl:min-w-[400px]">
            <CostEstimator
              addOns={addOnsServices}
              cloud={cloudProvider}
              cost={20 * serversNumber + 2 * addOnsServices.length}
              dataSources={[{ title: 'Pythia', list: ['Searcher'] }]}
              database="PostgreSQL"
              latency={latencyPreference}
              region={serviceRegion}
              serverType={serversType}
              serversNumber={serversNumber}
              service="Xnode"
            />
          </div>
        )}
      </div>

      <div className="w-full border-b text-[#D4D4D4]"></div>
    </>
  )
}

export default FirstStep

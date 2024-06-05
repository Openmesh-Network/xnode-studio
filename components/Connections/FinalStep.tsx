/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AccountContext } from '@/contexts/AccountContext'

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

/* eslint-disable react/no-unescaped-entities */
const FinalStep = () => {
  const {
    selectionSideNavBar,
    setSelectionSideNavBar,
    next,
    setNext,
    reviewYourBuild,
    setReviewYourBuild,
    finalNodes,
    setFinalBuild,
  } = useContext(AccountContext)

  const [loadingDone, setLoadingDone] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) return prevProgress + 2
        return prevProgress
      })
    }, 50)

    setTimeout(() => {
      clearInterval(interval)
      setLoadingDone(true) // Adicionar esta linha aqui
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <section
        id="home"
        className={`w-full bg-[#F9F9F9] px-[48px] pb-[1000px] pt-[88px] 2xl:px-[60px] 2xl:pt-[110px]`}
      >
        <div className="rounded-[5px] bg-[#fff] xl:px-[96px] xl:py-[64px] 2xl:px-[120px] 2xl:py-[80px]">
          <img
            src={`${
              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                ? process.env.NEXT_PUBLIC_BASE_PATH
                : ''
            }/images/connections/final.svg`}
            alt="image"
            className={`xl:w-[260px] 2xl:w-[325px]`}
          />
          <div className="font-bold text-[#000] xl:mt-[40px] xl:text-[13px] 2xl:mt-[50px] 2xl:text-[16px]">
            Authenticating
          </div>
          <div className="relative mt-4 h-4 w-full rounded bg-[#F9F9F9]">
            <div
              style={{ width: `${progress}%` }}
              className="absolute h-4 rounded bg-[#0354EC]"
            ></div>
          </div>

          {loadingDone && (
            <>
              <div className="mt-[5px] font-bold text-[#12AD50] xl:text-[13px] 2xl:text-[16px]">
                Success
              </div>
              <div
                onClick={() => {
                  setFinalBuild(true)
                }}
                className="mr-auto mt-[41px] flex size-fit cursor-pointer justify-center gap-x-[8px] rounded-[5px] bg-[#0354EC] px-[11px] py-[6.2px] text-center text-[7px] font-medium text-[#fff] hover:bg-[#0e2e69] md:mt-[49px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:mt-[57px] lg:px-[14.5px] lg:py-[8.75px] lg:text-[10px] xl:mb-[56px] xl:mt-[65px] xl:px-[17px] xl:py-[10px] xl:text-[11.2px] 2xl:mb-[70px] 2xl:mt-[82px] 2xl:gap-x-[10px] 2xl:px-[21px] 2xl:py-[12.5px] 2xl:text-[14px]"
              >
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }/images/header/storm.svg`}
                  alt="image"
                  className={`w-[5px] md:w-[6px] lg:w-[7px] xl:w-[8px] 2xl:w-[10px]`}
                />

                <div>Close</div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default FinalStep

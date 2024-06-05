'use client'

import { useEffect, useState } from 'react'
import { thirds } from '@/utils/third'

import { CoreServices } from '@/types/node'

interface ModalProps {
  onValueChange(): void
  coreServices: CoreServices[]
  isLoadingFeatures: boolean
}

const AddOns2 = ({ coreServices, isLoadingFeatures, ...data }: ModalProps) => {
  const [serviceIcons, setServiceIcons] = useState<string[]>([])
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)

  useEffect(() => {
    if (coreServices && coreServices.length > 0) {
      setServiceIcons(
        coreServices.map(() => '/images/reviewYourBuild/bola.svg')
      )
    }
  }, [coreServices])

  useEffect(() => {
    const updateIcon = () => {
      if (currentServiceIndex < coreServices.length) {
        setServiceIcons((prevIcons) =>
          prevIcons.map((icon, index) =>
            index === currentServiceIndex
              ? '/images/reviewYourBuild/checkGreen.svg'
              : icon
          )
        )
        setCurrentServiceIndex(currentServiceIndex + 1)
      }
    }
    if (isLoadingFeatures && currentServiceIndex <= coreServices.length + 1) {
      const timeout = setTimeout(updateIcon, 2000)
      return () => clearTimeout(timeout)
    }
  }, [isLoadingFeatures, currentServiceIndex, coreServices.length])

  const finalData = coreServices.filter((service) =>
    thirds.includes(service.name)
  )
  if (finalData.length === 0) {
    return
  }

  return (
    <div className="relative flex rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] pb-[20px] text-[#000] md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[12px] xl:pb-[40px] 2xl:px-[20px] 2xl:py-[15px] 2xl:pb-[50px]">
      <div className="relative flex gap-x-[10px]">
        <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
          Add-ons
        </div>
      </div>
      <div className="mb-[15px] ml-[47.5px] gap-x-[25px] md:ml-[57px] md:gap-x-[30px] lg:ml-[66.5px] lg:gap-x-[35px] xl:ml-[136px] xl:gap-x-[40px] 2xl:ml-[170px] 2xl:gap-x-[50px]">
        <div className="flex items-center gap-x-[7px] lg:gap-x-[15px]">
          <div
            className={`size-[10px] rounded-[5px] bg-transparent md:size-[12px] lg:size-[14px] xl:size-[16px] 2xl:size-[20px]`}
          ></div>
        </div>
        <div className="mt-[14px] grid gap-y-[11px] md:mt-[16.8px] md:gap-y-[13.2px] lg:mt-[19.6px] lg:gap-y-[15.4px] xl:mt-[22.4px] xl:gap-y-[17.6px] 2xl:mt-[28px] 2xl:gap-y-[22px]">
          {coreServices
            .filter((service) => thirds.includes(service.name))
            .map((option, index) => (
              <div key={index}>
                <div className="flex items-center gap-x-[8px] 2xl:gap-x-[10px]">
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }${serviceIcons[index]}`}
                    alt="image"
                    className="w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]"
                  />
                  <div className="relative text-[9px] font-bold text-[#313131] md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]">
                    {option.name}
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/reviewYourBuild/question.svg`}
                      alt="image"
                      className="absolute right-[-6px] top-0 w-[4px] md:right-[-7.2px] md:w-[4.8px] lg:right-[-8.4px] lg:w-[5.6px] xl:right-[-9.6px] xl:w-[6.4px] 2xl:right-[-12px] 2xl:w-[8px]"
                    />
                    {option.isFree && (
                      <div className="absolute right-[-25px] top-[-7.5px] text-[7px] font-normal text-[#12AD50] md:right-[-30px] md:top-[-9px] md:text-[8.4px] lg:right-[-35px] lg:top-[-10.5px] lg:text-[9.8px] xl:right-[-40px] xl:top-[-12px] xl:text-[11.2px] 2xl:right-[-50px] 2xl:top-[-15px] 2xl:text-[14px]">
                        Free
                      </div>
                    )}
                  </div>
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/reviewYourBuild/check.svg`}
                    alt="image"
                    className="absolute right-[37.5px] ml-auto w-[8.5px] md:right-[45px] md:w-[10.2px] lg:right-[52.5px] lg:w-[11.9px] xl:right-[60px] xl:w-[13.6px] 2xl:right-[75px] 2xl:w-[17px]"
                  />
                </div>
                <div className="pl-[15px] text-[7px] font-normal text-[#505050] md:pl-[18px] md:text-[8.4px] lg:pl-[21px] lg:text-[9.8px] xl:pl-[24px] xl:text-[11.2px] 2xl:pl-[30px] 2xl:text-[14px]">
                  {option.description}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default AddOns2

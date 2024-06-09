import { useState } from 'react'
import { prefix } from '@/utils/prefix'

interface ModalProps {
  cloudProvider: string
  onValueChange(): void
}

const CloudProvider = ({ ...data }: ModalProps) => {
  const [showTooltipCloudProvider, setShowTooltipCloudProvider] =
    useState<boolean>(false)

  return (
    <div className="flex rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] text-black md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[12px] 2xl:px-[20px] 2xl:py-[15px]">
      <div className="relative flex items-center gap-x-[10px]">
        <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
          Cloud provider
        </div>
        <img
          src={`${prefix}/images/firstStep/question-mark.svg`}
          alt="image"
          className="size-[9px] cursor-pointer transition-transform hover:scale-105 md:size-[11px] lg:size-[12px] xl:size-[14px] 2xl:size-[18px]"
          onMouseEnter={() => setShowTooltipCloudProvider(true)}
          onMouseLeave={() => setShowTooltipCloudProvider(false)}
        />
        {showTooltipCloudProvider && (
          <div className="absolute left-[130px] top-[-15px] w-[370px] rounded-[10px] bg-black px-[13px] py-[10px] text-[8px] font-medium text-white md:left-[162px] md:top-[-18px] md:px-[15px] md:py-[12px] md:text-[9px] lg:left-[189px] lg:top-[-21px] lg:px-[17px] lg:py-[14px] lg:text-[11px] lg:!leading-[19px] xl:left-[216px] xl:top-[-24px] xl:px-[20px] xl:py-[16px] xl:text-[13px] 2xl:left-[270px] 2xl:top-[-30px] 2xl:px-[25px] 2xl:py-[20px] 2xl:text-[16px]">
            <div className="mb-[7px]">Cloud provider</div>
            <div>Choose the cloud provider of your preference</div>
          </div>
        )}
      </div>
      <div className="ml-[47.5px] flex gap-x-[25px] md:ml-[57px] md:gap-x-[30px] lg:ml-[66.5px] lg:gap-x-[35px] xl:ml-[76px] xl:gap-x-[40px] 2xl:ml-[95px] 2xl:gap-x-[50px]">
        <div className="flex items-center gap-x-[7px] lg:gap-x-[15px]">
          <div
            className={`size-[10px] cursor-pointer rounded-[5px] border border-[#D9D9D9] bg-[#0354EC] hover:bg-[#0354EC] md:size-[12px] lg:size-[14px] xl:size-[16px] 2xl:size-[20px]`}
          ></div>
          <div className="flex 2xl:gap-x-[10px]">
            <div className="text-[10px] font-medium md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:text-[16px] 2xl:text-[20px]">
              {data.cloudProvider}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CloudProvider

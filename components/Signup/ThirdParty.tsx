import { useContext, useState } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import { prefix } from '@/utils/prefix'

const ThirdParty = () => {
  const [showTooltipCloudProvider, setShowTooltipCloudProvider] =
    useState<boolean>(false)
  const { setConnections } = useContext(AccountContext)

  return (
    <div className="relative rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] pb-[60px] pr-[100px] text-black md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[20px] xl:pb-[80px] xl:pr-[192px] 2xl:px-[20px] 2xl:py-[25px] 2xl:pb-[100px] 2xl:pr-[240px]">
      <div className="relative flex gap-x-[10px]">
        <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
          You will also need to connect to 3rd party services by integrations{' '}
        </div>
        <img
          src={`${prefix}/images/firstStep/question-mark.svg`}
          alt="image"
          className="size-[9px] cursor-pointer transition-transform hover:scale-105 md:size-[11px] lg:size-[12px] xl:size-[14px] 2xl:size-[18px]"
          onMouseEnter={() => setShowTooltipCloudProvider(true)}
          onMouseLeave={() => setShowTooltipCloudProvider(false)}
        />
        {showTooltipCloudProvider && (
          <div className="absolute left-[130px] top-0 w-full max-w-[270px] rounded-[10px] bg-black px-[13px] py-[10px] text-[8px] font-medium text-white md:left-[162px] md:px-[15px] md:py-[12px] md:text-[9px] lg:left-[189px] lg:px-[17px] lg:py-[14px] lg:text-[11px] lg:!leading-[19px] xl:left-[216px] xl:px-[20px] xl:py-[16px] xl:text-[13px] 2xl:left-[270px] 2xl:px-[25px] 2xl:py-[20px] 2xl:text-[16px]">
            <div>If you have any third party that needs connection</div>
          </div>
        )}
      </div>
      <div className="ml-[112px] mt-[56px] 2xl:ml-[140px] 2xl:mt-[70px]">
        <div>
          <img
            src={`${prefix}/images/header/connections-data.svg`}
            alt="image"
            className="w-[187px] md:w-[224px] lg:w-[260px] xl:w-[300px] 2xl:w-[374px]"
          />{' '}
        </div>
      </div>
      <div
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          setConnections(true)
        }}
        className="absolute cursor-pointer font-medium text-[#0354EC] underline underline-offset-1 xl:right-[160px] xl:top-[20px] 2xl:right-[200px] 2xl:top-[25px]"
      >
        Edit
      </div>
    </div>
  )
}

export default ThirdParty

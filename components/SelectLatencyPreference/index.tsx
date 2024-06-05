import { useState } from 'react'

import LatencySelector from '../LatencySelector'

interface ModalProps {
  next: Boolean
  onValueChange(string): void
}

const SelectLatencyPreference = ({ ...data }: ModalProps) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [latencyPreference, setLatencyPreference] = useState<string>('Low')

  const handleLatencyPreferenceChange = (newValue) => {
    setLatencyPreference(newValue)
    setEdit(false)
    data.onValueChange(newValue)
  }

  if (data.next && !edit) {
    return (
      <div className="flex rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[12px] 2xl:px-[20px] 2xl:py-[15px]">
        <div className="relative flex items-center gap-x-[10px]">
          <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
            3. Select latency preference
          </div>
        </div>
        <div className="ml-[37px] md:ml-[43px] lg:ml-[51px] xl:ml-[58.4px] 2xl:ml-[73px]">
          <div
            className={`flex size-full cursor-pointer items-center rounded-[3px] bg-[linear-gradient(255deg,_#94E50E_0%,_#12AD50_50.52%,_#12AD50_100%)] px-[12.5px] py-[6.25px] text-center text-[7px] font-bold text-white transition duration-500 ease-in-out hover:bg-[#e0e0e0] md:px-[15px] md:py-[7.5px] md:text-[8px] lg:px-[17.5px] lg:py-[8.75px] lg:text-[10px] lg:!leading-[17px] xl:px-[20px] xl:py-[10px] xl:text-[11px] 2xl:px-[25.5px] 2xl:py-[12.5px] 2xl:text-[14px]`}
          >
            <div className="mx-auto flex text-center"> {latencyPreference}</div>
          </div>
        </div>
        <div
          onClick={() => {
            setEdit(true)
          }}
          className="my-auto ml-auto mr-[22.5px] flex cursor-pointer items-center border-b border-[#0354EC] text-center text-[10px] font-medium text-[#0354EC] hover:border-[#123981] hover:text-[#123981] md:mr-[27px] md:text-[12px] lg:mr-[31.5px] lg:text-[14px] lg:!leading-[24px] xl:mr-[36px] xl:text-[16px] 2xl:mr-[45px] 2xl:text-[20px]"
        >
          Edit
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[12px] 2xl:px-[20px] 2xl:py-[15px]">
      <div className="relative flex items-center gap-x-[10px]">
        <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
          3. Select latency preference
        </div>
      </div>
      <div className="mt-[12px] items-center md:mt-[15px] md:flex md:gap-x-[91px] lg:mt-[17.5px] lg:gap-x-[107px] xl:gap-x-[122px] 2xl:mt-[25px] 2xl:gap-x-[153px]">
        <div className="text-[10px] font-medium md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:text-[16px] 2xl:text-[20px]">
          Latency
        </div>
        <div className="mt-[5px] w-full max-w-[213px] text-[7px] text-[#959595] md:ml-auto md:text-[8px] lg:text-[10px] lg:!leading-[17px] xl:text-[11px] 2xl:text-[14px]">
          Low latency ensures response time to be around 2-10ms
        </div>
        <div className="ml-auto mt-[5px] md:mt-0">
          <LatencySelector onValueChange={handleLatencyPreferenceChange} />
        </div>
      </div>
    </div>
  )
}

export default SelectLatencyPreference

import { useEffect, useRef, useState } from 'react'

import Presets from '../Presets'

interface ModalProps {
  next: Boolean
  onValueChange(string): void
  presetValueFromParent
}

const SelectUseCase = ({ presetValueFromParent, ...data }: ModalProps) => {
  const [showTooltipServiceRegion, setShowTooltipServiceRegion] =
    useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [preset, setPreset] = useState<number>(0)

  const useCaseRef = useRef(null)

  const handleUsecaseChangeChange = (newValue) => {
    setPreset(newValue)
    setEdit(false)
    // useCaseRef.current?.scrollIntoView({ behavior: 'smooth' })
    data.onValueChange(newValue)
  }

  useEffect(() => {
    if (presetValueFromParent !== undefined) {
      setPreset(presetValueFromParent)
    }
  }, [presetValueFromParent])

  const presetIndexToName = [
    {
      icon: '/images/presets/building.svg',
      iconStyle:
        'h-[12.5px] w-[11px] md:h-[15px] md:w-[12.5px]  lg:h-[17.5px] lg:w-[14.7px] xl:h-[20px] xl:w-[17px] 2xl:h-[25px] 2xl:w-[21px]',
      title: 'Building a decentralized data infrastructure',
    },
    {
      icon: '/images/presets/computer.svg',
      iconStyle:
        'h-[12.5px] w-[15.5px] md:h-[15px] md:w-[18.5px]  lg:h-[17.5px] lg:w-[21.7px] xl:h-[20px] xl:w-[25px] 2xl:h-[25px] 2xl:w-[31px]',
      title: 'Developing Apps and dApps',
    },
    {
      icon: '/images/presets/chart.svg',
      iconStyle:
        'h-[12.5px] w-[16.5px] md:h-[15px] md:w-[20px]  lg:h-[17.5px] lg:w-[23px] xl:h-[20px] xl:w-[26px] 2xl:h-[25px] 2xl:w-[33px]',
      title: 'Real time analysis engine',
    },
    {
      icon: '/images/presets/research.svg',
      iconStyle: 'w-[16px] md:w-[19px]lg:w-[22.5px]xl:w-[25.5px]  2xl:w-[25px]',
      title: 'Research and development',
    },
    {
      icon: '/images/presets/person.svg',
      iconStyle:
        'h-[12.5px] w-[15.5px] md:h-[15px] md:w-[18.5px]  lg:h-[17.5px] lg:w-[21.7px] xl:h-[20px] xl:w-[25px] 2xl:h-[25px] 2xl:w-[31px]',
      title: 'Run a validator',
    },
    {
      icon: '/images/presets/robot.svg',
      iconStyle:
        'h-[12.5px] w-[15.5px] transform cursor-pointer transition-transform hover:scale-105 md:h-[15px] md:w-[18.5px]  lg:h-[17.5px] lg:w-[21.7px] xl:h-[20px] xl:w-[25px] 2xl:h-[25px] 2xl:w-[31px]',
      title: 'Customized LLMs, analytics, and dashboards',
    },
    {
      icon: '/images/presets/custom.svg',
      iconStyle:
        'h-[12.5px] w-[15.5px] transform cursor-pointer transition-transform hover:scale-105 md:h-[15px] md:w-[18.5px]  lg:h-[17.5px] lg:w-[21.7px] xl:h-[20px] xl:w-[25px] 2xl:h-[25px] 2xl:w-[28px]',
      title: 'Build your own data cloud',
    },
  ]

  if (data.next && !edit) {
    return (
      <div className="flex rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[12px] 2xl:px-[20px] 2xl:py-[15px]">
        <div className="relative flex items-center gap-x-[10px]">
          <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
            4. Usecase
          </div>
        </div>
        <div className="ml-[121px] flex gap-x-[7.5px] md:ml-[145px] md:gap-x-[10.5px] lg:ml-[170px] lg:gap-x-[9px] xl:ml-[195px] xl:gap-x-[12px] 2xl:ml-[243px] 2xl:gap-x-[15px]">
          <img
            src={`${
              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                ? process.env.NEXT_PUBLIC_BASE_PATH
                : ''
            }${presetIndexToName[preset].icon}`}
            alt="image"
            className={`cursor-pointer transition-transform hover:scale-105${presetIndexToName[preset].iconStyle}`}
          />
          <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
            {presetIndexToName[preset].title}
          </div>
        </div>
        <div
          onClick={() => {
            setEdit(true)
          }}
          className="ml-auto mr-[22.5px] cursor-pointer border-b border-[#0354EC] text-[10px] font-medium text-[#0354EC] hover:border-[#123981] hover:text-[#123981] md:mr-[27px] md:text-[12px] lg:mr-[31.5px] lg:text-[14px] lg:!leading-[24px] xl:mr-[36px] xl:text-[16px] 2xl:mr-[45px] 2xl:text-[20px]"
        >
          Edit
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        ref={useCaseRef} // Adicione a referência aqui
        className="rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[12px] 2xl:px-[20px] 2xl:py-[15px]"
      >
        <div className="relative flex items-center gap-x-[10px]">
          <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
            4. Usecase
          </div>
        </div>
        <div
          className={`mt-[12px] p-[10px] md:p-[12px] lg:mt-[17.5px] lg:p-[14px] xl:p-[16px] 2xl:mt-[25px] 2xl:p-[20px]`}
        >
          <Presets
            onValueChange={(value) => {
              handleUsecaseChangeChange(value)
            }}
          />
        </div>
      </div>
      {/* <div className="mt-[10px] rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px]   md:mt-[12px] md:px-[12px] md:py-[9px] lg:mt-[14px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[12px] 2xl:mt-[20px] 2xl:px-[20px] 2xl:py-[15px]">
        <div className="items-center  md:flex md:gap-x-[91px]  lg:gap-x-[107px] xl:gap-x-[122px]  2xl:gap-x-[153px]">
          <div className="text-[8px] font-semibold text-black md:text-[9.6px]  lg:text-[11.2px]  lg:!leading-[19px] xl:text-[12.8px] 2xl:text-[16px]">
            * Number of servers
          </div>
          <div className="flex gap-x-[5px] text-[7px] font-bold text-[#505050] md:ml-auto md:text-[8px] lg:gap-x-[10px] lg:text-[10px] lg:!leading-[17px] xl:text-[11px] 2xl:text-[14px]">
            <div
              onClick={() => {
                data.onChangeServerType('small')
              }}
              className={`cursor-pointer  rounded-[3px] bg-[#f1f1f1] px-[10px] py-[3.25px] hover:bg-white md:px-[12px] md:py-[4px] lg:px-[14px] lg:py-[4.5px] xl:px-[16px] xl:py-[5.2px] 2xl:px-[20px] 2xl:py-[6.5px] ${
                data.serverType === 'small'
                  ? 'border-[2px] border-[#0354EC] shadow-[0_2px_5px_0px_rgba(3,84,236,0.50)]'
                  : 'border-[2px] border-[#D4D4D4]'
              }`}
            >
              Small
            </div>
            <div
              onClick={() => {
                data.onChangeServerType('large')
              }}
              className={`cursor-pointer rounded-[3px] bg-[#f1f1f1] px-[10px] py-[3.25px] hover:bg-white md:px-[12px] md:py-[4px] lg:px-[14px] lg:py-[4.5px] xl:px-[16px] xl:py-[5.2px] 2xl:px-[20px] 2xl:py-[6.5px] ${
                data.serverType === 'large'
                  ? 'border-[2px] border-[#0354EC] shadow-[0_2px_5px_0px_rgba(3,84,236,0.50)]'
                  : 'border-[2px] border-[#D4D4D4]'
              }`}
            >
              Large
            </div>
          </div>
          <div className="ml-auto flex gap-x-[5px] text-[7px] font-bold text-[#505050] md:gap-x-[6px] md:text-[8px] lg:gap-x-[7px] lg:text-[10px] lg:!leading-[17px] xl:gap-x-[8px] xl:text-[11px] 2xl:gap-x-[10px] 2xl:text-[14px]">
            {numberOfServersOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  data.onChangeServerNumber(option)
                }}
                className={`cursor-pointer  rounded-[3px] bg-[#f1f1f1] px-[13px] py-[3.25px] hover:bg-white md:px-[15.5px] md:py-[4px] lg:px-[18px] lg:py-[4.5px] xl:px-[21px] xl:py-[5.2px] 2xl:px-[26px] 2xl:py-[6.5px] ${
                  data.serversNumber === option
                    ? 'border-[2px] border-[#0354EC] shadow-[0_2px_5px_0px_rgba(3,84,236,0.50)]'
                    : 'border-[2px] border-[#D4D4D4]'
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </>
  )
}

export default SelectUseCase

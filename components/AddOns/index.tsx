/* eslint-disable no-unused-vars */
import { useState } from 'react'

interface ModalProps {
  includedAddOnsArray: string[]
  onChangeIncludedAddOns(string): void
}

/* eslint-disable react/no-unescaped-entities */
const AddOns = ({ ...data }: ModalProps) => {
  const observabilityOptions = [
    {
      title: 'Grafana',
      description: 'Explanation here',
    },
    {
      title: 'Prometheus',
      description: 'Explanation here',
    },
  ]

  const apisAndConnectionsOptions = [
    {
      title: 'REST API',
      description: 'Explanation here',
    },
    {
      title: 'GraphQL',
      description: 'Explanation here',
    },
    {
      title: 'Kafka',
      description: 'Explanation here',
    },
  ]

  const [isPythiaDescOpen, setIsPythiaDescOpen] = useState<boolean>(true)

  return (
    <>
      <div className="w-full">
        <div className="">
          <div className="text-[18px] font-medium tracking-[-2%] text-[#959595] md:text-[19px] lg:text-[22px] lg:!leading-[39px] xl:text-[25px] 2xl:text-[32px]">
            Add apps
          </div>
          <div className="mt-[15px] text-[10px] font-medium !-tracking-[2%] text-[#000] md:mt-[18px] md:text-[12px] lg:mt-[21px] lg:text-[14px] xl:text-[16px] 2xl:mt-[30px] 2xl:text-[20px]">
            Available applications that you can add to your deployment
            (optional)
          </div>
        </div>
        <div className="mt-[15px] flex w-full max-w-[1053px] justify-start gap-x-[12.5px] rounded-[5px] border-[0.5px] border-[#D9D9D9] p-[15px] shadow-[0_5px_8px_0px_rgba(0,0,0,0.10)] md:mt-[18px] md:gap-x-[15px] md:p-[18px] lg:mt-[21px] lg:gap-x-[17.5px] lg:p-[21px] xl:gap-x-[20px] xl:p-[24px] 2xl:mt-[30px] 2xl:gap-x-[25px] 2xl:p-[30px]">
          <div className="size-[52px] 2xl:size-[64px]">
            <img
              src={`${
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                  ? process.env.NEXT_PUBLIC_BASE_PATH
                  : ''
              }/images/addOns/pythia.png`}
              alt="image"
              className={`mx-auto flex size-[25px] rounded-[5px] p-[3px] shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] lg:size-[30px] lg:p-[7px] xl:size-[40px]`}
            />
            <div className="mx-auto mt-[4px] flex justify-center text-[7px] font-semibold text-[#12AD50] lg:!leading-[17px] xl:mt-[8px] xl:text-[11px] 2xl:mt-[10px] 2xl:text-[14px]">
              Free
            </div>
          </div>
          <div className="w-full">
            <div className="w-full">
              <div className="flex w-full gap-x-[5px] lg:gap-x-[8px] 2xl:gap-x-[10px]">
                <div className="text-[10px] font-bold text-[#313131] md:text-[12px] lg:text-[14px] lg:!leading-[22px] 2xl:text-[18px]">
                  Pythia Search
                </div>
                <div className="h-fit rounded-[5px] border border-[#FFC946] bg-[#FFE9B2] px-[4px] py-[2] text-[5px] font-semibold lg:px-[5px] lg:py-[4px] lg:text-[8px] 2xl:px-[7px] 2xl:py-[5px] 2xl:text-[10px] 2xl:!leading-[12px]">
                  POPULAR ADD-ON
                </div>
                <div className="ml-auto flex items-center gap-x-[8px] md:gap-x-[9px] lg:gap-x-[10.5px] xl:gap-x-[12px] 2xl:gap-x-[15px]">
                  <div className="text-[8px] font-medium text-[#505050] md:text-[9.6px] lg:text-[11.2px] lg:!leading-[24px] xl:text-[12.8px] 2xl:text-[16px]">
                    Added to deployment
                  </div>
                  <div
                    onClick={() => {
                      data.onChangeIncludedAddOns('pythia')
                    }}
                    className={`size-[10px] cursor-pointer rounded-[5px] border border-[#D9D9D9] bg-[#fff] md:size-[12px] lg:size-[14px] xl:size-[16px] 2xl:size-[20px] ${
                      data.includedAddOnsArray.includes('pythia')
                        ? 'bg-[#0354EC]'
                        : 'bg-[#fff]'
                    }`}
                  />
                </div>
              </div>
              {isPythiaDescOpen && (
                <div className="flex w-full justify-between">
                  <div className="mt-[8px] line-clamp-5 w-full max-w-[450px] overflow-hidden text-[8px] font-medium text-[#959595] md:text-[10px] lg:mt-[12px] lg:text-[12px] lg:!leading-[19px] 2xl:mt-[15px] 2xl:text-[16px]">
                    A single endpoint for all crypto & web3 data, accessible to
                    anyone, anywhere, always free. No license, no registration,
                    no setup fees{' '}
                  </div>
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/addOns/arrow-up.svg`}
                    alt="image"
                    onClick={() => {
                      setIsPythiaDescOpen(!isPythiaDescOpen)
                    }}
                    className={`ml-auto mt-auto cursor-pointer lg:w-[30px] xl:h-[10px] xl:w-[15px]`}
                  />
                </div>
              )}
              {!isPythiaDescOpen && (
                <div className="flex w-full justify-between">
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/addOns/arrow-down.svg`}
                    alt="image"
                    onClick={() => {
                      setIsPythiaDescOpen(!isPythiaDescOpen)
                    }}
                    className={`ml-auto mt-[30px] cursor-pointer lg:w-[30px] xl:h-[10px] xl:w-[15px]`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-[15px] rounded-[10px] bg-[#F9F9F9] p-[10px] md:mt-[18px] md:p-[12px] lg:mt-[21px] lg:p-[14px] xl:p-[16px] 2xl:mt-[30px] 2xl:p-[20px]">
          <div className="text-[10px] font-bold text-[#000] md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
            Observability
          </div>
          <div className="relative mt-[12.5px] grid justify-between gap-[15px] md:mt-[15px] md:grid-cols-2 md:gap-[18px] lg:mt-[17.5px] lg:grid-cols-2 lg:gap-[21px] xl:grid-cols-3 xl:gap-[24px] 2xl:mt-[25px] 2xl:grid-cols-3 2xl:gap-[30px]">
            {observabilityOptions.map((option, index) => (
              <div
                className={`relative h-[100px] cursor-pointer rounded-[5px] border-[0.5px] border-[#D9D9D9] bg-[#fff] p-[10px] shadow-[0_5px_8px_0px_rgba(0,0,0,0.10)] hover:shadow-[0_4px_20px_0px_rgba(3,84,236,0.40)] md:p-[12px] lg:h-[150px] lg:p-[14px] xl:p-[16px] 2xl:p-[20px]`}
                key={index}
                onClick={() => {
                  data.onChangeIncludedAddOns(option.title)
                }}
              >
                <div className="size-full max-w-[300px]">
                  <div className="text-[9px] font-bold text-[#313131] md:text-[11px] lg:text-[12.5px] lg:!leading-[22px] xl:text-[14.5px] 2xl:text-[18px]">
                    {option.title}
                  </div>
                  <div className="mr-[10px] mt-[5px] text-[8px] font-medium text-[#959595] md:mr-[12px] md:mt-[6px] md:text-[9px] lg:mr-[14px] lg:mt-[7px] lg:text-[11px] lg:!leading-[19px] xl:text-[13px] 2xl:mr-[20px] 2xl:mt-[10px] 2xl:text-[16px]">
                    {option.description}
                  </div>
                </div>
                {data.includedAddOnsArray.includes(option.title) && (
                  <div className="absolute right-0 top-px">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/presets/check.svg`}
                      alt="image"
                      className={
                        'h-[21px] w-[25px] md:h-[25px] md:w-[30px] lg:h-[29.5px] lg:w-[35px] xl:h-[33px] xl:w-[40px] 2xl:h-[42px] 2xl:w-[50px]'
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-[15px] rounded-[10px] bg-[#F9F9F9] p-[10px] md:mt-[18px] md:p-[12px] lg:mt-[21px] lg:p-[14px] xl:p-[16px] 2xl:mt-[30px] 2xl:p-[20px]">
          <div className="text-[10px] font-bold text-[#000] md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
            APIs & Connectivity
          </div>
          <div className="relative mt-[12.5px] grid justify-between gap-[15px] md:mt-[15px] md:grid-cols-2 md:gap-[18px] lg:mt-[17.5px] lg:grid-cols-2 lg:gap-[21px] xl:grid-cols-3 xl:gap-[24px] 2xl:mt-[25px] 2xl:grid-cols-3 2xl:gap-[30px]">
            {apisAndConnectionsOptions.map((option, index) => (
              <div
                className={`relative h-[100px] cursor-pointer rounded-[5px] border-[0.5px] border-[#D9D9D9] bg-[#fff] p-[10px] shadow-[0_5px_8px_0px_rgba(0,0,0,0.10)] hover:shadow-[0_4px_20px_0px_rgba(3,84,236,0.40)] md:p-[12px] lg:h-[150px] lg:p-[14px] xl:p-[16px] 2xl:p-[20px]`}
                key={index}
                onClick={() => {
                  data.onChangeIncludedAddOns(option.title)
                }}
              >
                <div className="size-full max-w-[300px]">
                  <div className="text-[9px] font-bold text-[#313131] md:text-[11px] lg:text-[12.5px] lg:!leading-[22px] xl:text-[14.5px] 2xl:text-[18px]">
                    {option.title}
                  </div>
                  <div className="mr-[10px] mt-[5px] text-[8px] font-medium text-[#959595] md:mr-[12px] md:mt-[6px] md:text-[9px] lg:mr-[14px] lg:mt-[7px] lg:text-[11px] lg:!leading-[19px] xl:text-[13px] 2xl:mr-[20px] 2xl:mt-[10px] 2xl:text-[16px]">
                    {option.description}
                  </div>
                </div>
                {data.includedAddOnsArray.includes(option.title) && (
                  <div className="absolute right-0 top-px">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/presets/check.svg`}
                      alt="image"
                      className={
                        'h-[21px] w-[25px] md:h-[25px] md:w-[30px] lg:h-[29.5px] lg:w-[35px] xl:h-[33px] xl:w-[40px] 2xl:h-[42px] 2xl:w-[50px]'
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default AddOns

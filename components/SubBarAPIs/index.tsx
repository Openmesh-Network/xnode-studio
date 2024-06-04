/* eslint-disable no-unused-vars */
import { title } from 'process'
import { useContext, useState } from 'react'
import { AccountContext } from '@/contexts/AccountContext'

import Dropdown from '../Dropdown'
import LatencySelector from '../LatencySelector'

/* eslint-disable react/no-unescaped-entities */
const SubBarAPIs = ({ onValueChange }) => {
  const [presetId, setPresetId] = useState(0)
  const {
    selectionSideNavBar,
    setSelectionSideNavBar,
    next,
    setNext,
    setChangeNodes,
  } = useContext(AccountContext)
  const [selectionSubBar, setSelectionSubBar] = useState<string>('')

  const categoriesOptions = [
    {
      title: 'WebSocket',
      desc: 'Data Streaming service',
      link: 'Access live markets data & blockchain data. Power your dApps, web and mobile applications',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      src: '/images/subNavBarAPIs/apis.svg',
      style: '2xl:w-[26px] xl:w-[20.8px] lg:w-[18.2px] md:w-[15.6px] w-[13px]',
      isFree: true,
      enabled: true,
    },
    {
      title: 'REST',
      desc: 'Historical data-as-a-service',
      link: 'Access live markets data & blockchain data. Power your dApps, web and mobile applications',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      src: '/images/subNavBarAPIs/rest.svg',
      style: '2xl:w-[33px] xl:w-[26px] lg:w-[23px] md:w-[20px] w-[16px]',
      isFree: true,
      enabled: true,
    },
    {
      title: 'GraphQL',
      desc: 'Building custom data queries ',
      link: 'Access live markets data & blockchain data. Power your dApps, web and mobile applications',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      src: '/images/subNavBarAPIs/graphql.svg',
      style: '2xl:w-[28px] xl:w-[22.5px] lg:w-[19.6px] md:w-[17px] w-[14px]',
      isFree: true,
      enabled: true,
    },
    {
      title: 'Kafka',
      desc: 'Building custom data queries ',
      link: 'Access live markets data & blockchain data. Power your dApps, web and mobile applications',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      src: '/images/subNavBarAPIs/kafka.svg',
      style: '2xl:w-[24px] xl:w-[19px] lg:w-[17px] md:w-[14.4px] w-[12px]',
      isFree: false,
      enabled: false,
    },
    {
      title: 'Kafka',
      desc: 'Building custom data queries ',
      link: 'Access live markets data & blockchain data. Power your dApps, web and mobile applications',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      src: '/images/subNavBarAPIs/kafka.svg',
      style: '2xl:w-[24px] xl:w-[19px] lg:w-[17px] md:w-[14.4px] w-[12px]',
      isFree: false,
      enabled: false,
    },
  ]

  const dataUseCase = {
    'Financial Analysis':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/dV24UPM1pxtu3arLSfCk/getting-started/about-openmesh',
    Github: 'https://github.com/L3A-Protocol',
    'Blockchain Transactions':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/streaming-service/supported-feeds-and-symbols',
    'DEXs and CEXs':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/streaming-service/schema-reference',
    'Gas Optimization':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/query-service/overview',
    'Crypto Liquidity':
      'https://app.gitbook.com/o/7CcuVeAus8lBlwxastky/s/OErOpMfD3LOGh2v4NZot/infrastructure/data-flow',
  }

  function handleButtonClick(title: string) {
    console.log('nothing')
  }

  function renderSubOptions(option: any) {
    return (
      <div className="mb-[25px] mt-[6.5px] grid gap-y-[15px] pl-[19px] md:mb-[30px] md:mt-[7.5px] md:gap-y-[18px] md:pl-[22px] lg:mb-[35px] lg:mt-[8.5px] lg:gap-y-[21px] lg:pl-[27px] xl:mb-[40px] xl:mt-[10px] xl:gap-y-[24px] xl:pl-[30px] 2xl:mb-[50px] 2xl:mt-[12px] 2xl:gap-y-[30px] 2xl:pl-[38px]">
        {option.dataOptions.map((option, index) => (
          <div key={index} className="relative flex text-[#000]">
            <div className="flex gap-x-[9px]">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }${option.icon}`}
                alt="image"
                className={`w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]`}
              />
              <a
                href={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? `/xnode/data-products`
                    : `/data-products`
                }`}
              >
                <div className="cursor-pointer text-[7.5px] font-light underline underline-offset-[2.5px] hover:font-normal md:text-[8.5px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]">
                  {option.title}
                </div>
              </a>
            </div>
            <div
              onClick={() => {
                setNext(true)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="absolute right-0 top-[-2px] cursor-pointer rounded-[5px] bg-[#0354EC] px-[7px] py-[3px] text-[6.5px] font-medium text-white hover:bg-[#123981] md:text-[7px] lg:px-[6px] lg:py-[2.8px] lg:text-[8.5px] lg:!leading-[15px] xl:px-[6.8px] xl:py-[3.2px] xl:text-[9.5px] 2xl:px-[8.5px] 2xl:py-[4px] 2xl:text-[12px]"
            >
              <div>Add</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="z-100 relative min-w-[260px] bg-[#fff] px-[16px] py-[21px] text-[#000] shadow-[0_0px_5px_0px_rgba(0,0,0,0.12)] md:px-[20px] md:py-[26px] lg:px-[23px] lg:py-[30px] xl:px-[26.5px] xl:py-[35px] 2xl:min-w-[330px] 2xl:px-[33px] 2xl:py-[43px]">
        <img
          src={`${
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
              ? process.env.NEXT_PUBLIC_BASE_PATH
              : ''
          }/images/subNavBarAPIs/unifiedAPIs.svg`}
          onClick={() => setSelectionSideNavBar('')}
          alt="image"
          className="w-[90px] md:w-[108px] lg:w-[126px] xl:w-[144px] 2xl:w-[180px]"
        />
        <div className="mt-[7.5px] max-w-[140px] text-[9px] font-light md:mt-[9px] md:max-w-[167px] md:text-[11px] lg:mt-[10.5px] lg:max-w-[195px] lg:text-[12.5px] lg:!leading-[22px] xl:mt-[12px] xl:max-w-[223px] xl:text-[14.5px] 2xl:mt-[15px] 2xl:max-w-[279px] 2xl:text-[18px]">
          Single endpoint for all crypto & web3 data, free forever.
        </div>
        {/* <img
          src="/images/lateralNavBar/close.svg"
          onClick={() => setSelectionSideNavBar('')}
          alt="image"
          className="absolute top-[15px] flex w-[8px] cursor-pointer items-center lg:right-[24px] lg:w-[9px] 2xl:right-[30px] 2xl:w-[11px]"
        /> */}
        <div className="mt-[14px] grid gap-y-[40px] md:mt-[17px] md:gap-y-[48px] lg:gap-y-[56px] xl:mt-[70px] xl:gap-y-[64px] 2xl:mt-[87px] 2xl:gap-y-[80px]">
          {categoriesOptions.map((option, index) => (
            <div key={index}>
              <div
                onClick={() => {
                  if (option.enabled) {
                    handleButtonClick(option.title)
                  }
                }}
                className={`relative text-[9px] font-normal md:text-[10px] lg:mt-[19.5px] lg:text-[11px] xl:text-[13px] 2xl:text-[16px]`}
              >
                <div
                  className={` ${
                    option.enabled
                      ? 'cursor-pointer hover:text-[#5b5b5b]'
                      : 'text-[#9A9A9A]'
                  } relative flex w-fit gap-x-[5px]`}
                >
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }${option.src}`}
                    alt="image"
                    className={option.style} // Adicionando uma transição de 2 segundos
                  />
                  <div className="font-semibold">{option.title}</div>
                  {option.isFree && (
                    <div className="absolute right-[-27px] top-[-14px] text-[7.5px] font-normal text-[#12AD50] md:text-[8.5px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]">
                      Free
                    </div>
                  )}
                </div>
                <div
                  className={`mt-[9px] ${
                    option.enabled ? 'text-[#000]' : 'text-[#A1A0A0]'
                  } font-light md:mt-[11px] lg:mt-[12.5px] xl:mt-[14px] 2xl:mt-[18px]`}
                >
                  {option.desc}
                </div>
                <a href={option.linkRef} target="_blank" rel="noreferrer">
                  <div
                    className={`mt-[5.5px] ${
                      option.enabled
                        ? 'text-[#0354EC] hover:text-[#0243bd]'
                        : 'text-[#B0B0B0]'
                    } max-w-[120px] text-[6px] font-light md:mt-[6.6px] md:max-w-[144px] md:text-[7.2px] lg:mt-[6.7px] lg:max-w-[192px] lg:text-[8.4px] lg:!leading-[150%] xl:mt-[7.8px] xl:max-w-[220px] xl:text-[9.5px] 2xl:mt-[9px] 2xl:max-w-[275px] 2xl:text-[12px]`}
                  >
                    {option.link}
                  </div>
                </a>
                <div
                  onClick={() => {
                    setChangeNodes({
                      type: 'api',
                      name: option.title,
                    })
                  }}
                  className={`absolute ${
                    option.enabled
                      ? 'cursor-pointer bg-[#0354EC] hover:bg-[#123981]'
                      : 'bg-[#898989]'
                  } right-0 top-[-2px] rounded-[5px] px-[7px] py-[3px] text-[6.5px] font-medium text-white md:text-[7px] lg:px-[6px] lg:py-[2.8px] lg:text-[8.5px] lg:!leading-[15px] xl:px-[6.8px] xl:py-[3.2px] xl:text-[9.5px] 2xl:px-[8.5px] 2xl:py-[4px] 2xl:text-[12px]`}
                >
                  <div>Add</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-[62px] max-w-[110px] text-[9px] md:mt-[75px] md:max-w-[132px] md:text-[10px] lg:mt-[87.5px] lg:max-w-[154px] lg:text-[11px] xl:mt-[100px] xl:max-w-[176px] xl:text-[13px] 2xl:mt-[125px] 2xl:max-w-[220px] 2xl:text-[16px]">
          <div className="border-y border-[#D9D9D9] pb-[8px] pt-[7.5px] md:pt-[9px] lg:pb-[12px] lg:pt-[10.5px] xl:pt-[12px] 2xl:py-[15px]">
            <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
              Support articles
            </div>
            <div className="lg:!leading-[150%]">
              <a
                href={'https://www.openmesh.network/oec/register'}
                target="_blank"
                className="border-b font-medium text-[#0354EC]"
                rel="noreferrer"
              >
                Join our community and let us know what you’d like to add!
              </a>
            </div>
          </div>
          <div className="mt-[8px] pb-[8px] lg:mt-[12px] lg:pb-[12px] 2xl:mt-[15px] 2xl:pb-[15px]">
            <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
              Provide a data source
            </div>
            <div className="lg:!leading-[150%]">
              {' '}
              <a
                href={
                  'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases'
                }
                target="_blank"
                className="border-b font-medium text-[#0354EC]"
                rel="noreferrer"
              >
                Run an Xnode today{' '}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SubBarAPIs

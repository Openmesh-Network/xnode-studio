import { useContext, useState } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import { optionServerLocation } from '@/utils/constants'
import { prefix } from '@/utils/prefix'

import DropdownServiceRegion from '../DropdownServiceRegion'

/* eslint-disable react/no-unescaped-entities */
const SubBarServers = ({ onValueChange }) => {
  const [presetId, setPresetId] = useState(0)
  const {
    selectionSideNavBar,
    setSelectionSideNavBar,
    next,
    setNext,
    setChangeNodes,
  } = useContext(AccountContext)
  const [selectionSubBar, setSelectionSubBar] = useState<string>('')
  const [cloudProvider, setCloudProvider] = useState<string>('Equinix')

  const [smallServerNumber, setSmallServerNumber] = useState<number>(0)
  const [mediumServerNumber, setMediumServerNumber] = useState<number>(0)
  const [largeServerNumber, setLargeServerNumber] = useState<number>(0)

  const [serviceRegion, setServiceRegion] = useState<string>(
    optionServerLocation[0]
  )

  const optionsServiceRegionSelection = [
    {
      title: 'Dallas',
      src: '/images/subNavBarServers/aws.svg',
      style: '2xl:w-[31px] xl:w-[25px] lg:w-[22px]  md:w-[19px] w-[16px]',
    },
  ]

  const categoriesOptions = [
    {
      title: 'Equinix',
      enabled: true,
      src: '/images/subNavBarServers/equinix.svg',
      pageRef: '/data-product/30e53394-407d-44fc-ae23-c45951b77024',
      style:
        '2xl:w-[31px] xl:w-[25px] lg:w-[22px]  md:w-[19px] w-[16px] !-left-[10px]',
    },
    {
      title: 'GCP',
      enabled: false,
      src: '/images/subNavBarServers/gcp.svg',
      pageRef: '/data-product',
      style: '2xl:w-[17px] xl:w-[13.5px] lg:w-[12px]  md:w-[10.2px] w-[8.5px]',
    },
    {
      title: 'Local (Coming soon...)',
      enabled: false,
      src: '/images/subNavBarServers/local.svg',
      pageRef: '/data-product/2e762548-ec51-48c8-aa07-10b9eae87ee4',
      style: '2xl:w-[22px] xl:w-[17.5px] lg:w-[15.5px]  md:w-[13.2px] w-[11px]',
    },
    {
      title: 'AWS',
      enabled: false,
      src: '/images/subNavBarServers/aws.svg',
      pageRef: '/data-product/2e762548-ec51-48c8-aa07-10b9eae87ee4',
      style: '2xl:w-[22px] xl:w-[17.5px] lg:w-[15.5px]  md:w-[13.2px] w-[11px]',
    },
    {
      title: 'Azure',
      enabled: false,
      src: '/images/subNavBarServers/azure.svg',
      pageRef: '/data-product',
      style: '2xl:w-[17px] xl:w-[13.5px] lg:w-[12px]  md:w-[10.2px] w-[8.5px]',
    },
  ]

  const chooseYourServerOptions = [
    {
      title: 'Small c3.x86',
      enabled: true,
      specs: [
        '1x 8 Core @ 3.40Ghz',
        '32GB RAM',
        '2x 480GB SSD',
        '2x 10Gbps',
        '1x Intel HD Graphics P630',
      ],
      link: 'Rapid prototype, Data user (Unified API)',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      servers: smallServerNumber,
    },
    {
      title: 'Medium c2.x86',
      enabled: true,
      specs: [
        '1x 8 Core @ 3.40Ghz',
        '32GB RAM',
        '2x 480GB SSD',
        '2x 10Gbps',
        '1x Intel HD Graphics P630',
      ],
      link: 'Rapid prototype, Decentralized data cloud + Analytics',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      servers: mediumServerNumber,
    },
    {
      title: 'Large 23.x86',
      enabled: true,
      specs: [
        '1x 8 Core @ 3.40Ghz',
        '32GB RAM',
        '2x 480GB SSD',
        '2x 10Gbps',
        '1x Intel HD Graphics P630',
      ],
      link: 'Build, manage, and scale decentralized data clouds + Low latency + Heavy Analytics',
      linkRef:
        'https://open-mesh.gitbook.io/l3a-v3-documentation-2.0/openmesh/use-cases',
      servers: largeServerNumber,
    },
  ]

  function handleButtonClick(title: string) {
    if (title === selectionSubBar) {
      setSelectionSubBar('')
    } else {
      setSelectionSubBar(title)
    }
  }

  function handleAddServer(option: any) {
    if (option.servers > 0) {
      let numberServer = 1
      if (option.title === 'Small c3.x86') {
        numberServer = smallServerNumber
      } else if (option.title === 'Medium c2.x86') {
        numberServer = mediumServerNumber
      } else if (option.title === 'Large 23.x86') {
        numberServer = largeServerNumber
      }
      setChangeNodes({
        type: 'server',
        defaultValueServerType: `${option.title} x ${numberServer}`,
        defaultValueLocation: serviceRegion,
        defaultValueCloudProvider: cloudProvider,
      })
    }
  }

  function handleServerPlus(title: string) {
    if (title === 'Small c3.x86') {
      if (smallServerNumber <= 2) {
        setSmallServerNumber(smallServerNumber + 1)
      }
    } else if (title === 'Medium c2.x86') {
      if (mediumServerNumber <= 2) {
        setMediumServerNumber(mediumServerNumber + 1)
      }
    } else if (title === 'Large 23.x86') {
      if (largeServerNumber <= 2) {
        setLargeServerNumber(largeServerNumber + 1)
      }
    }
  }

  function handleServerMinus(title: string) {
    if (title === 'Small c3.x86') {
      if (smallServerNumber > 0) {
        setSmallServerNumber(smallServerNumber - 1)
      }
    } else if (title === 'Medium c2.x86') {
      if (mediumServerNumber > 0) {
        setMediumServerNumber(mediumServerNumber - 1)
      }
    } else if (title === 'Large 23.x86') {
      if (largeServerNumber > 0) {
        setLargeServerNumber(largeServerNumber - 1)
      }
    }
  }

  function renderChooseYourServerOptions() {
    return (
      <div className="mt-[11px] grid gap-y-[22px] md:mt-[13px] md:gap-y-[27px] lg:mt-[15.5px] lg:gap-y-[31px] xl:mt-[17.5px] xl:gap-y-[35px] 2xl:mt-[22px] 2xl:min-w-[290px] 2xl:gap-y-[44px]">
        {chooseYourServerOptions.map((option, index) => (
          <div key={index} className="relative">
            <div className="relative flex gap-x-[8px] text-black md:gap-x-[9.6px] lg:gap-x-[11.2px] xl:gap-x-[13px] 2xl:gap-x-[16px]">
              <div>
                <div className="text-[8px] font-medium md:text-[9.6px] lg:text-[11.2px] lg:!leading-[300%] xl:text-[13px] 2xl:text-[16px]">
                  {option.title}
                </div>
                {option.title === 'Equinix (Decentralized)' && (
                  <div className="absolute right-[-27px] top-[-14px] text-[7.5px] font-normal text-[#12AD50] md:text-[8.5px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]">
                    Recommended
                  </div>
                )}
                <div className="text-[7px] font-light md:text-[8.4px] lg:text-[10px] lg:!leading-[150%] xl:text-[11.2px] 2xl:text-[14px]">
                  {option.specs.map((spec, index2) => (
                    <div key={index2}> {spec}</div>
                  ))}
                </div>
              </div>
              <div className="mt-[6px] h-fit">
                <div className="flex h-fit items-center gap-x-[3px]">
                  <div
                    onClick={() => handleServerMinus(option.title)}
                    className="cursor-pointer text-[7px] hover:text-[#6d6a6a] md:text-[8.4px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]"
                  >
                    -
                  </div>
                  <div className="flex h-[10px] w-[15px] items-center justify-center rounded-[5px] border border-[#D9D9D9] p-px text-[7px] font-normal md:h-[12.5px] md:w-[18px] md:text-[9.8px] lg:h-[15px] lg:w-[21px] lg:text-[9.8px] xl:h-[17px] xl:w-[24px] xl:text-[11.2px] 2xl:h-[21px] 2xl:w-[30px] 2xl:text-[14px]">
                    {option.servers}
                  </div>
                  <div
                    onClick={() => handleServerPlus(option.title)}
                    className="cursor-pointer text-[7px] hover:text-[#6d6a6a] md:text-[8.4px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]"
                  >
                    +
                  </div>
                </div>
                <div
                  onClick={() => {
                    handleAddServer(option)
                    // window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={`mx-auto mt-[10px] w-fit !leading-[15px] ${
                    option.servers > 0
                      ? 'cursor-pointer bg-[#0354EC] hover:bg-[#123981]'
                      : 'bg-[#939393]'
                  } rounded-[5px] px-[7px] py-[3px] text-[6.5px] font-medium text-white md:mt-[12px] md:text-[7px] lg:mt-[14px] lg:px-[6px] lg:py-[2.8px] lg:text-[8.5px] lg:!leading-[15px] xl:mt-[16px] xl:px-[6.8px] xl:py-[3.2px] xl:text-[9.5px] 2xl:mt-[20px] 2xl:px-[8.5px] 2xl:py-[4px] 2xl:text-[12px]`}
                >
                  <div>Add</div>
                </div>
              </div>
            </div>
            <a href={option.linkRef} target="_blank" rel="noreferrer">
              <div className="mt-[5.5px] max-w-[120px] text-[6px] font-light text-[#0354EC] hover:text-[#0243bd] md:mt-[6.6px] md:max-w-[144px] md:text-[7.2px] lg:mt-[7.7px] lg:max-w-[168px] lg:text-[8.4px] lg:!leading-[150%] xl:mt-[8.8px] xl:max-w-[192px] xl:text-[9.5px] 2xl:mt-[11px] 2xl:max-w-[240px] 2xl:text-[12px]">
                {option.link}
              </div>
            </a>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="z-100 relative bg-white px-[18px] py-[29px] pr-[33px] text-black shadow-[0_0px_5px_0px_rgba(0,0,0,0.12)] md:px-[20px] md:py-[34.5px] md:pr-[40px] lg:px-[23px] lg:py-[40px] lg:pr-[47px] xl:px-[27px] xl:py-[45.5px] xl:pr-[54px] 2xl:py-[57px] 2xl:pl-[33px] 2xl:pr-[67px]">
        <div className="text-[9px] font-bold md:text-[11px] lg:text-[12.5px] xl:text-[14.5px] 2xl:text-[18px]">
          Select cloud provider{' '}
        </div>
        {/* <img
          src="/images/lateralNavBar/close.svg"
          onClick={() => setSelectionSideNavBar('')}
          alt="image"
          className="absolute top-[15px] flex w-[8px] cursor-pointer items-center lg:right-[24px] lg:w-[9px] 2xl:right-[30px] 2xl:w-[11px]" // Adicionando uma transição de 2 segundos
        /> */}
        <div className="mt-[8px] md:mt-[10.2px] lg:mt-[12px] xl:mt-[13.5px] 2xl:mt-[17px]">
          {categoriesOptions.map((option, index) => (
            <div key={index} className="relative flex">
              <div className="flex gap-x-[4px]">
                <img
                  src={`${prefix}${option.src}`}
                  alt="image"
                  className={`absolute left-[-5px] top-[15px] my-auto ${option.style}`}
                />
                <a
                  href={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? `/xnode${option.pageRef}`
                      : `${option.pageRef}`
                  }`}
                >
                  <div
                    className={` ${
                      option.enabled ? 'text-black' : 'text-[#B1B1B1]'
                    } ml-[25px] text-[8px] font-light md:text-[10px] lg:text-[11px] lg:!leading-[300%] xl:text-[13px] 2xl:text-[16px]`}
                  >
                    {option.title}
                  </div>
                </a>
                {option.title === 'Equinix (Decentralized)' && (
                  <div className="absolute text-[7.5px] font-normal text-[#12AD50] md:text-[8.5px] lg:text-[10px] xl:right-[-8px] xl:top-[-11.2px] xl:text-[11.2px] 2xl:right-[-10px] 2xl:top-[-14px] 2xl:text-[14px]">
                    Recommended
                  </div>
                )}
              </div>
              <div
                onClick={() => {
                  if (option.enabled) {
                    setCloudProvider(option.title)
                  }
                }}
                className={`absolute right-[-20px] top-[10px] size-[10px] rounded-[5px] border border-[#D9D9D9] ${
                  option.enabled ? 'cursor-pointer hover:bg-[#0354EC]' : ''
                } md:size-[12px] lg:size-[14px] xl:size-[16px] 2xl:size-[20px] ${
                  cloudProvider === option.title && option.enabled
                    ? 'bg-[#0354EC]'
                    : 'bg-white'
                }`}
              ></div>
            </div>
          ))}
        </div>
        <div className="mt-[28px] text-[9px] font-bold md:mt-[33px] md:text-[11px] lg:mt-[38.5px] lg:text-[12.5px] xl:mt-[44px] xl:text-[14.5px] 2xl:mt-[55px] 2xl:text-[18px]">
          Select service region{' '}
        </div>
        <div className="mt-[12px] w-fit md:mt-[14.5px] lg:mt-[17px] xl:mt-[19px] 2xl:mt-[24px]">
          <DropdownServiceRegion
            onValueChange={(value) => {
              setServiceRegion(value.title)
            }}
          />
        </div>
        <div className="mt-[35px] text-[9px] font-bold md:mt-[42px] md:text-[11px] lg:mt-[49px] lg:text-[12.5px] xl:mt-[56px] xl:text-[14.5px] 2xl:mt-[70px] 2xl:text-[18px]">
          Choose your server{' '}
        </div>
        <div>{renderChooseYourServerOptions()}</div>
        <a
          href={`${
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
              ? `/xnode/data-products?category=Servers`
              : `/data-products?category=Servers`
          }`}
        >
          <div className="mt-[35px] flex w-full justify-center text-[8px] font-medium hover:text-[#3a3a3a] md:mt-[41px] md:text-[9.6px] lg:mt-[48px] lg:text-[11.5px] lg:!leading-[300%] xl:mt-[55px] xl:text-[13px] 2xl:mt-[69px] 2xl:text-[16px]">
            View More
          </div>
        </a>
        <div className="mt-[44px] max-w-[110px] text-[9px] md:mt-[52px] md:max-w-[132px] md:text-[10px] lg:mt-[60px] lg:max-w-[154px] lg:text-[11px] xl:mt-[70px] xl:max-w-[176px] xl:text-[13px] 2xl:mt-[88px] 2xl:max-w-[220px] 2xl:text-[16px]">
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

export default SubBarServers

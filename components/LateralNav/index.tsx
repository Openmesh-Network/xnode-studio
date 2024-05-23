'use client'

/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-useless-return */
/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect } from 'react'
import Dropdown from '../Dropdown'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import LatencySelector from '../LatencySelector'
import { title } from 'process'
import { AccountContext } from '@/contexts/AccountContext'
import SubBarData from '../SubBarData'
import SubBarServers from '../SubBarServers'
import SubBarAPIs from '../SubBarAPIs'
import SubBarAnalytics from '../SubBarAnalytics'
import SubBarRPC from '../SubBarRPC'
import SubBarUtility from '../SubBarUtility'
import SubBarML from '../SubBarML'
import SubBarStorage from '../SubBarStorage'
import SubBarDataManagement from '../SubBarDataManagement'
import SubBarCompute from '../SubBarCompute'
import SubBarTrading from '../SubBarTrading'

/* eslint-disable react/no-unescaped-entities */
const LateralNav = () => {
  const [categoriesOptions, setCategoriesOptions] = useState([])
  const [presetId, setPresetId] = useState(0)
  const {
    selectionSideNavBar,
    setSelectionSideNavBar,
    next,
    setNext,
    nextFromScratch,
    setNextFromScratch,
    setReviewYourBuild,
    setFinalBuild,
    setSignup,
    user,
  } = useContext(AccountContext)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [greenDotOpacity, setGreenDotOpacity] = useState(0)
  const { push } = useRouter()
  const [hoveredIcon, setHoveredIcon] = useState(null)

  const preSetsOptionsUser = [
    {
      icon: '/images/lateralNavBar/new-home.png',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Home',
    },
    {
      icon: '/images/lateralNavBar/workspace.svg',
      iconStyle: 'w-[12px] md:w-[14.5px] lg:w-[17px] xl:w-[20px] 2xl:w-[20px]',
      title: 'Workspace',
    },
    {
      icon: '/images/lateralNavBar/new-apps.svg',
      iconStyle: 'w-[12px] md:w-[14.5px] lg:w-[17px] xl:w-[20px] 2xl:w-[20px]',
      title: 'Templates',
    },
    {
      icon: '/images/lateralNavBar/new-dashboard.svg',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Dashboard',
    },
    {
      icon: '/images/lateralNavBar/new-servers.svg',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Servers',
    },
    {
      icon: '/images/lateralNavBar/new-data.svg',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Data',
    },
    {
      icon: '/images/lateralNavBar/new-apis.png',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'APIs',
    },
    {
      icon: '/images/lateralNavBar/new-rpc.png',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'RPC',
    },
    {
      icon: '/images/lateralNavBar/new-analytics.svg',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Analytics',
    },
    {
      icon: '/images/lateralNavBar/new-data-management.svg',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Data management',
    },
    {
      icon: '/images/lateralNavBar/new-storage.svg',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Storage',
    },
    {
      icon: '/images/lateralNavBar/new-compute.svg',
      iconStyle:
        'w-[11px] md:w-[13.2px] lg:w-[15.5px] xl:w-[18px] 2xl:w-[22px]',
      title: 'Compute',
    },
    {
      icon: '/images/lateralNavBar/new-trading.svg',
      iconStyle: 'w-[9px] md:w-[11px] lg:w-[12.6px] xl:w-[14.4px] 2xl:w-[18px]',
      title: 'Trading',
    },
    {
      icon: '/images/lateralNavBar/new-ai.svg',
      iconStyle:
        'w-[11px] md:w-[13.2px] lg:w-[15.5px] xl:w-[17.6px] 2xl:w-[22px]',
      title: 'ML/LLMs',
    },
    {
      icon: '/images/lateralNavBar/new-utility.svg',
      iconStyle: 'w-[10px]  md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Apps',
    },
    {
      icon: '/images/lateralNavBar/new-utility.svg',
      iconStyle: 'w-[10px]  md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Utility',
    },
    {
      icon: '/images/lateralNavBar/new-docs.svg',
      iconStyle: 'w-[10px]  md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Docs',
    },
    {
      icon: '/images/lateralNavBar/new-profile.png',
      iconStyle: 'w-[10px]  md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Profile',
    },
  ]

  const preSetsOptions = [
    {
      icon: '/images/lateralNavBar/new-home.png',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Home',
    },
    {
      icon: '/images/lateralNavBar/workspace.svg',
      iconStyle: 'w-[12px] md:w-[14.5px] lg:w-[17px] xl:w-[20px] 2xl:w-[20px]',
      title: 'Workspace',
    },
    {
      icon: '/images/lateralNavBar/new-apps.svg',
      iconStyle: 'w-[12px] md:w-[14.5px] lg:w-[17px] xl:w-[20px] 2xl:w-[20px]',
      title: 'Templates',
    },
    {
      icon: '/images/lateralNavBar/new-servers.svg',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Servers',
    },
    {
      icon: '/images/lateralNavBar/new-data.svg',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Data',
    },
    {
      icon: '/images/lateralNavBar/new-apis.png',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'APIs',
    },
    {
      icon: '/images/lateralNavBar/new-rpc.png',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'RPC',
    },
    {
      icon: '/images/lateralNavBar/new-analytics.svg',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Analytics',
    },
    {
      icon: '/images/lateralNavBar/new-data-management.svg',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Data management',
    },
    {
      icon: '/images/lateralNavBar/new-storage.svg',
      iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Storage',
    },
    {
      icon: '/images/lateralNavBar/new-compute.svg',
      iconStyle:
        'w-[11px] md:w-[13.2px] lg:w-[15.5px] xl:w-[18px] 2xl:w-[22px]',
      title: 'Compute',
    },
    {
      icon: '/images/lateralNavBar/new-trading.svg',
      iconStyle: 'w-[9px] md:w-[11px] lg:w-[12.6px] xl:w-[14.4px] 2xl:w-[18px]',
      title: 'Trading',
    },
    {
      icon: '/images/lateralNavBar/new-ai.svg',
      iconStyle:
        'w-[11px] md:w-[13.2px] lg:w-[15.5px] xl:w-[17.6px] 2xl:w-[22px]',
      title: 'ML/LLMs',
    },
    {
      icon: '/images/lateralNavBar/new-utility.svg',
      iconStyle: 'w-[10px]  md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Apps',
    },
    {
      icon: '/images/lateralNavBar/new-utility.svg',
      iconStyle: 'w-[10px]  md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Utility',
    },
    {
      icon: '/images/lateralNavBar/new-docs.svg',
      iconStyle: 'w-[10px]  md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
      title: 'Docs',
    },
  ]

  const [sideBarOptions, setSideBarOptions] = useState<any>(preSetsOptions)

  function handleButtonClick(title: string) {
    if (title === 'Workspace') {
      push(
        `${
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
            ? `/xnode/workspace`
            : `/workspace`
        }`,
      )
      setNext(true)
      setReviewYourBuild(false)
      setFinalBuild(false)
      setSignup(false)
      setSelectionSideNavBar('Workspace')
      return
    }
    if (title === 'Docs') {
      push(
        `${
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
            ? `/xnode/docs`
            : `/docs`
        }`,
      )
      setSelectionSideNavBar('Docs')
    }
    if (title === 'Templates') {
      push(
        `${
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
            ? `/xnode/template-products`
            : `/template-products`
        }`,
      )
      setSelectionSideNavBar('Docs')
    }
    if (title === 'Profile') {
      push(
        `${
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
            ? `/xnode/profile`
            : `/profile`
        }`,
      )
      setSelectionSideNavBar('Profile')
    }
    if (title === 'Dashboard') {
      push(
        `${
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
            ? `/xnode/dashboard`
            : `/dashboard`
        }`,
      )
      setSelectionSideNavBar('Dashboard')
    }
    if (title === 'Home') {
      setNextFromScratch(false)
      console.log('set next false yes')
      setNext(false)
      setReviewYourBuild(false)
      setSelectionSideNavBar('Home')
      setFinalBuild(false)
      setSignup(false)
      push(
        `${
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
            ? `/xnode/start-here`
            : `/start-here`
        }`,
      )
      return
    }
    // if (!next && !nextFromScratch && title !== 'Home' && !user) {
    //   setGreenDotOpacity(1) // Mostrar a bolinha verde com opacidade total
    //   setTimeout(() => setGreenDotOpacity(0), 1000) // Esconder a bolinha verde após 5 segundos
    // } else {
    //   setSelectionSideNavBar(title)
    // }
    setSelectionSideNavBar(title)
    setHoveredIcon(title)
  }

  function handleButtonHover(title: string) {
    // if (!next && !nextFromScratch && title !== 'Home' && !user) {
    //   return
    // } else {
    //   setHoveredIcon(title)
    // }
    setHoveredIcon(title)
  }

  useEffect(() => {
    if (user) {
      setSideBarOptions(preSetsOptionsUser)
    } else {
      setSideBarOptions(preSetsOptions)
    }
  }, [user])

  if (!isOpen) {
    return (
      <div className="h-full shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="flex w-[42px]  flex-col items-center justify-center px-[15px] pb-[45px] pt-[49px] md:w-[51px] md:px-[11.5px] md:pb-[54px] md:pt-[58.8px] lg:w-[60px] lg:px-[13.5px] lg:pb-[63px] lg:pt-[68.5px] xl:w-[68px] xl:px-[15px] xl:pb-[72px] xl:pt-[78.4px] 2xl:w-[85px] 2xl:px-[15px] 2xl:pb-[90px] 2xl:pt-[98px]">
          <ul className="flex flex-col items-center gap-[20px] md:gap-[24px] lg:gap-[28px] xl:gap-[32px] 2xl:gap-[40px]">
            {sideBarOptions.map((option, index) => (
              <li className="relative" key={index}>
                <img
                  onClick={() => setIsOpen(true)}
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }${option.icon}`}
                  alt="image"
                  className={`${option.iconStyle} cursor-pointer`}
                />
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }/images/lateralNavBar/new-arrow.svg`}
                  alt="image"
                  className={` ${
                    option.title === 'Home' ||
                    option.title === 'Dashboard' ||
                    option.title === 'Workspace' ||
                    option.title === 'Templates'
                      ? 'hidden'
                      : ''
                  } absolute right-[14px] top-[2.5px] w-[4px] md:right-[16.8px] md:top-[3px] md:w-[4.8px] lg:right-[19.6px] lg:top-[3.5px] lg:w-[5.6px] xl:right-[22.4px] xl:top-[4px] xl:w-[6.4px] 2xl:right-[28px] 2xl:top-[5px] 2xl:w-[8px]`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="z-50 h-full max-w-[109px] pb-[200px] shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] md:w-full md:max-w-[130px]  md:pb-[600px] lg:max-w-[152px] xl:max-w-[180px] 2xl:max-w-[230px]">
        <div className="flex  flex-col items-start">
          <div className="mb-[14.5px] ml-[16px] mt-[24.5px]  flex flex-row items-center  justify-between md:mb-[17.4px] md:ml-[19.2px] md:mt-[29.4px] lg:mb-[20.3px] lg:ml-[22.4px] lg:mt-[34.3px] xl:mb-[21.2px] xl:ml-[25.6px] xl:mt-[39.2px] 2xl:mb-[29px] 2xl:ml-[32px] 2xl:mt-[49px]">
            <div className="flex w-[10.5px] cursor-pointer flex-col items-center md:top-[16.8px] md:w-[12.9px] lg:top-[19.6px] lg:w-[15.05px] xl:top-[22.4px]  xl:w-[17.2px] 2xl:top-[28px] 2xl:w-[21.5px]">
              <img
                onClick={() => setIsOpen(false)}
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/lateralNavBar/nav.svg`}
                alt="image"
                className="cursor-pointer transition-transform duration-300"
              />
              <a
                href={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? `/xnode/`
                    : '/'
                }`}
                className="absolute -top-[8px] left-[15px] flex w-[50px] cursor-pointer flex-col items-center md:-top-[9.6px] md:left-[30px] md:w-[60px] lg:-top-[11.2px]  lg:left-[35px] lg:w-[70px] xl:-top-[12.8px] xl:left-[40px] xl:w-[80px] 2xl:-top-[16px] 2xl:left-[50px] 2xl:w-[100px] "
              >
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }/images/logo/xnode-new-logo.svg`}
                  alt="image"
                  className="w-[40px] md:w-[80px] lg:w-[120px] xl:w-[160px] 2xl:w-[200px]"
                />
              </a>
            </div>
          </div>
          {sideBarOptions.map((option, index) => (
            <div
              key={index}
              onMouseEnter={() => handleButtonHover(option.title)}
              onClick={() => {
                handleButtonClick(option.title)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`relative flex w-full flex-row items-center justify-between gap-[7.5px] px-[13px] py-[10px] md:gap-[9px] md:px-[20px]  md:py-[12px]  lg:gap-[10.5px] lg:px-[23px] lg:py-[14px] xl:gap-[12px] xl:px-[26.4px] xl:py-[16px] 2xl:gap-[15px] 2xl:px-[33px]  2xl:py-[20px] ${
                // !next &&
                // !nextFromScratch &&
                // option.title !== 'Home' && option.title !== 'Workspace' && !user
                //   ? 'w-full opacity-50 hover:bg-[#fff]':
                'cursor-pointer hover:bg-[#F4F4F4]'
              } ${selectionSideNavBar === option.title ? 'bg-[#F4F4F4]' : ''}`}
            >
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }${option.icon}`}
                alt="image"
                className={`${option.iconStyle}  mx-auto`}
              />
              {option.title === 'Home' && (
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }/images/lateralNavBar/green-ellipse.svg`}
                  alt="green dot"
                  style={{ opacity: greenDotOpacity }}
                  className="absolute right-2 top-2 h-3 w-3 transition-opacity duration-500"
                />
              )}
              <div className=" flex w-full items-center text-start font-inter text-[9px] font-medium !-tracking-[2%] text-[#000]  md:text-[8.4px] lg:text-[10px] xl:text-[11.2px]  2xl:text-[14px] 2xl:!leading-[19px]">
                {option.title}
              </div>
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/lateralNavBar/new-arrow.svg`}
                alt="image"
                className={` ${
                  option.title === 'Home' ||
                  option.title === 'Dashboard' ||
                  option.title === 'Workspace' ||
                  option.title === 'Templates'
                    ? 'hidden'
                    : ''
                } absolute left-[7px] top-[12.5px] w-[4px] md:left-[10.2px] md:top-[15px] md:w-[4.8px] lg:left-[12px] lg:top-[17.5px] lg:w-[5.6px] xl:left-[13.6px] xl:top-[20px] xl:w-[6.4px] 2xl:left-[17px] 2xl:top-[25px] 2xl:w-[8px]`}
              />
            </div>
          ))}
          {hoveredIcon === 'Data' && (
            <div className="absolute right-0 top-[80px] translate-x-[100%] transform">
              <SubBarData onValueChange={console.log('')} />
            </div>
          )}
        </div>

        {hoveredIcon === 'Servers' && (
          <div className="absolute right-0 top-[80px] translate-x-[100%] transform">
            <SubBarServers onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'APIs' && (
          <div className="absolute right-0 top-[80px] translate-x-[100%] transform">
            <SubBarAPIs onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'Analytics' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute right-0 top-[80px] translate-x-[100%] transform"
          >
            <SubBarAnalytics onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'RPC' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute right-0 top-[80px] translate-x-[100%] transform"
          >
            <SubBarRPC onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'ML/LLMs' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute right-0 top-[80px] translate-x-[100%] transform"
          >
            <SubBarML onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'Storage' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute right-0 top-[80px] translate-x-[100%] transform"
          >
            <SubBarStorage onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'Data management' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute right-0 top-[80px] translate-x-[100%] transform"
          >
            <SubBarDataManagement onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'Compute' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute right-0 top-[80px] translate-x-[100%] transform"
          >
            <SubBarCompute onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'Trading' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute right-0 top-[80px] translate-x-[100%]"
          >
            <SubBarTrading onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'Utility' ? (
          <div className="absolute right-0 top-[80px] translate-x-[100%] transform">
            <SubBarUtility onValueChange={console.log('')} />
          </div>
        ) : null}
      </div>
    </>
  )
}

export default LateralNav

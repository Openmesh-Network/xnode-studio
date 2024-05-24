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
const LateralNav = ({ onValueChange }) => {
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
    // {
    //   icon: '/images/lateralNavBar/new-servers.svg',
    //   iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
    //   title: 'Servers',
    // },
    // {
    //   icon: '/images/lateralNavBar/new-data.svg',
    //   iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
    //   title: 'Data',
    // },
    // {
    //   icon: '/images/lateralNavBar/new-apis.png',
    //   iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
    //   title: 'APIs',
    // },
    // {
    //   icon: '/images/lateralNavBar/new-rpc.png',
    //   iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
    //   title: 'RPC',
    // },
    // {
    //   icon: '/images/lateralNavBar/new-analytics.svg',
    //   iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
    //   title: 'Analytics',
    // },
    // {
    //   icon: '/images/lateralNavBar/new-data-management.svg',
    //   iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
    //   title: 'Data management',
    // },
    // {
    //   icon: '/images/lateralNavBar/new-storage.svg',
    //   iconStyle: 'w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
    //   title: 'Storage',
    // },
    // {
    //   icon: '/images/lateralNavBar/new-compute.svg',
    //   iconStyle:
    //     'w-[11px] md:w-[13.2px] lg:w-[15.5px] xl:w-[18px] 2xl:w-[22px]',
    //   title: 'Compute',
    // },
    // {
    //   icon: '/images/lateralNavBar/new-trading.svg',
    //   iconStyle: 'w-[9px] md:w-[11px] lg:w-[12.6px] xl:w-[14.4px] 2xl:w-[18px]',
    //   title: 'Trading',
    // },
    // {
    //   icon: '/images/lateralNavBar/new-ai.svg',
    //   iconStyle:
    //     'w-[11px] md:w-[13.2px] lg:w-[15.5px] xl:w-[17.6px] 2xl:w-[22px]',
    //   title: 'ML/LLMs',
    // },
    // {
    //   icon: '/images/lateralNavBar/new-utility.svg',
    //   iconStyle: 'w-[10px]  md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
    //   title: 'Apps',
    // },
    // {
    //   icon: '/images/lateralNavBar/new-utility.svg',
    //   iconStyle: 'w-[10px]  md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]',
    //   title: 'Utility',
    // },
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
            ? `/xnode/`
            : `/`
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

  return (
    <>
      <div className="relative z-50 min-h-[100vh] h-full shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="flex  flex-col items-start">
          {sideBarOptions.map((option, index) => (
            <div
              key={index}
              onMouseEnter={() => handleButtonHover(option.title)}
              onClick={() => {
                handleButtonClick(option.title)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`relative flex w-full flex-row items-center justify-between gap-[7.5px] px-[13px] py-[10px] md:gap-[9px] lg:gap-[10.5px] xl:gap-[12px] 2xl:gap-[15px] ${
                // !next &&
                // !nextFromScratch &&
                // option.title !== 'Home' && option.title !== 'Workspace' && !user
                //   ? 'w-full opacity-50 hover:bg-[#fff]':
                'cursor-pointer hover:bg-[#E6EEFC]'
              } ${selectionSideNavBar === option.title ? 'bg-[#E6EEFC] border-l-4 border-[#0059FF]' : ''}`}
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
                  className="absolute top-2 right-2 h-3 w-3 transition-opacity duration-500"
                />
              )}
              <div className=" flex w-full items-center text-start font-inter text-sm font-medium !-tracking-[2%] text-[#000] 2xl:!leading-[19px]">
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
                } absolute top-[12.5px] left-[7px] w-[4px] md:top-[15px] md:left-[10.2px] md:w-[4.8px] lg:top-[17.5px] lg:left-[12px] lg:w-[5.6px] xl:top-[20px] xl:left-[13.6px] xl:w-[6.4px] 2xl:top-[25px] 2xl:left-[17px] 2xl:w-[8px]`}
              />
            </div>
          ))}
          {hoveredIcon === 'Data' && (
            <div className="absolute top-[80px] right-0 translate-x-[100%] transform">
              <SubBarData onValueChange={console.log('')} />
            </div>
          )}
        </div>

        {hoveredIcon === 'Servers' && (
          <div className="absolute top-[80px] right-0 translate-x-[100%] transform">
            <SubBarServers onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'APIs' && (
          <div className="absolute top-[80px] right-0 translate-x-[100%] transform">
            <SubBarAPIs onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'Analytics' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute top-[80px] right-0 translate-x-[100%] transform"
          >
            <SubBarAnalytics onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'RPC' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute top-[80px] right-0 translate-x-[100%] transform"
          >
            <SubBarRPC onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'ML/LLMs' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute top-[80px] right-0 translate-x-[100%] transform"
          >
            <SubBarML onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'Storage' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute top-[80px] right-0 translate-x-[100%] transform"
          >
            <SubBarStorage onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'Data management' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute top-[80px] right-0 translate-x-[100%] transform"
          >
            <SubBarDataManagement onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'Compute' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute top-[80px] right-0 translate-x-[100%] transform"
          >
            <SubBarCompute onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'Trading' && (
          <div
            onMouseLeave={() => setHoveredIcon(null)}
            className="absolute top-[80px] right-0 translate-x-[100%]"
          >
            <SubBarTrading onValueChange={console.log('')} />
          </div>
        )}
        {hoveredIcon === 'Utility' ? (
          <div className="absolute top-[80px] right-0 translate-x-[100%] transform">
            <SubBarUtility onValueChange={console.log('')} />
          </div>
        ) : null}
      </div>
    </>
  )
}

export default LateralNav

'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { CaretDown, HouseLine } from 'phosphor-react'
import Link from 'next/link'

import * as Accordion from '@radix-ui/react-accordion'

export function LateralNav() {
  const [expandedItem, setExpandedItem] = useState<string>('')

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: <HouseLine size={20} weight="regular" color="#4D4D4D" />,
      activeIcon: <HouseLine size={20} weight="regular" color="#0059FF" />,
      collapsable: false,
      subItems: [],
    },
    {
      label: 'Workspace',
      href: '/workspace',
      icon: <HouseLine size={20} weight="regular" color="#4D4D4D" />,
      activeIcon: <HouseLine size={20} weight="regular" color="#0059FF" />,
      collapsable: true,
      subItems: [],
    },
  ]

  const pathname = usePathname()

  return (
    <aside className="flex-grow-1 hidden w-[280px] flex-col border-r border-[#D1D5DB] bg-gray100 lg:flex">
      <div>
        <span className="block px-6 py-4 text-xs font-medium uppercase text-darkGray">
          STUDIO
        </span>

        <ul>
          {navItems.map(
            ({ activeIcon, collapsable, href, icon, label, subItems }) => {
              const isActive = pathname.includes(href)

              const currentIcon = isActive ? activeIcon : icon

              if (collapsable)
                return (
                  <Accordion.Root
                    key={href}
                    type="single"
                    defaultValue="item-1"
                    collapsible
                  >
                    <Accordion.Item
                      value="label"
                      className={`relative flex flex-col items-center ${
                        isActive ? 'bg-[#E5EEFC]' : 'bg-transparent'
                      }`}
                    >
                      <Accordion.Trigger className="flex w-full items-center justify-between">
                        <div
                          className={`relative flex h-10 w-full items-center${
                            isActive ? 'bg-[#E5EEFC]' : 'bg-transparent'
                          }`}
                        >
                          {isActive ? (
                            <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue500" />
                          ) : null}
                          <div className="flex w-full items-center justify-between px-6">
                            <div className="flex items-center gap-x-3">
                              {currentIcon}
                              <strong
                                className={
                                  isActive
                                    ? 'text-sm font-bold text-darkGray'
                                    : 'text-sm font-medium text-darkGray'
                                }
                              >
                                {label}
                              </strong>
                            </div>
                            <CaretDown
                              weight="bold"
                              size={16}
                              color="#4D4D4D"
                            />
                          </div>
                        </div>
                        <CaretDown size={20} />
                      </Accordion.Trigger>
                      <Accordion.Content>Mock content here</Accordion.Content>
                    </Accordion.Item>
                  </Accordion.Root>
                )

              return (
                <li key={label}>
                  <Link href={href}>
                    <div
                      className={`relative flex h-10 w-full items-center${
                        isActive ? 'bg-[#E5EEFC]' : 'bg-transparent'
                      }`}
                    >
                      {isActive ? (
                        <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue500" />
                      ) : null}
                      <div className="flex items-center gap-x-3 px-6">
                        {currentIcon}
                        <strong
                          className={
                            isActive
                              ? 'text-sm font-bold text-darkGray'
                              : 'text-sm font-medium text-darkGray'
                          }
                        >
                          {label}
                        </strong>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            },
          )}
        </ul>
      </div>
    </aside>
  )

  // if (!isOpen) {
  //   return (
  //     <div className="hidden h-screen w-[280px] border-r  border-[#D1D5DB] bg-[#FAFAFA] lg:block">
  //       <div className="flex w-[42px]  flex-col items-center justify-center px-[15px] pb-[45px] pt-[49px] md:w-[51px] md:px-[11.5px] md:pb-[54px] md:pt-[58.8px] lg:w-[60px] lg:px-[13.5px] lg:pb-[63px] lg:pt-[68.5px] xl:w-[68px] xl:px-[15px] xl:pb-[72px] xl:pt-[78.4px] 2xl:w-[85px] 2xl:px-[15px] 2xl:pb-[90px] 2xl:pt-[98px]">
  //         <ul className="flex flex-col items-center gap-[20px] md:gap-[24px] lg:gap-[28px] xl:gap-[32px] 2xl:gap-[40px]">
  //           {sideBarOptions.map((option, index) => (
  //             <li className="relative" key={index}>
  //               <img
  //                 onClick={() => setIsOpen(true)}
  //                 src={`${
  //                   process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
  //                     ? process.env.NEXT_PUBLIC_BASE_PATH
  //                     : ''
  //                 }${option.icon}`}
  //                 alt="image"
  //                 className={`${option.iconStyle} cursor-pointer`}
  //               />
  //               <img
  //                 src={`${
  //                   process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
  //                     ? process.env.NEXT_PUBLIC_BASE_PATH
  //                     : ''
  //                 }/images/lateralNavBar/new-arrow.svg`}
  //                 alt="image"
  //                 className={` ${
  //                   option.title === 'Home' ||
  //                   option.title === 'Dashboard' ||
  //                   option.title === 'Workspace' ||
  //                   option.title === 'Templates'
  //                     ? 'hidden'
  //                     : ''
  //                 } absolute right-[14px] top-[2.5px] w-[4px] md:right-[16.8px] md:top-[3px] md:w-[4.8px] lg:right-[19.6px] lg:top-[3.5px] lg:w-[5.6px] xl:right-[22.4px] xl:top-[4px] xl:w-[6.4px] 2xl:right-[28px] 2xl:top-[5px] 2xl:w-[8px]`}
  //               />
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     </div>
  //   )
  // }

  // return (
  //   <>
  //     <div className="z-50 h-screen max-w-[109px] bg-[#FAFAFA] pb-[200px]  md:w-full md:max-w-[130px]  md:pb-[600px] lg:max-w-[152px] xl:max-w-[180px] 2xl:max-w-[230px]">
  //       <div className="flex  flex-col items-start">
  //         <div className="mb-[14.5px] ml-[16px] mt-[24.5px]  flex flex-row items-center  justify-between md:mb-[17.4px] md:ml-[19.2px] md:mt-[29.4px] lg:mb-[20.3px] lg:ml-[22.4px] lg:mt-[34.3px] xl:mb-[21.2px] xl:ml-[25.6px] xl:mt-[39.2px] 2xl:mb-[29px] 2xl:ml-[32px] 2xl:mt-[49px]">
  //           <div className="flex w-[10.5px] cursor-pointer flex-col items-center md:top-[16.8px] md:w-[12.9px] lg:top-[19.6px] lg:w-[15.05px] xl:top-[22.4px]  xl:w-[17.2px] 2xl:top-[28px] 2xl:w-[21.5px]">
  //             <img
  //               onClick={() => setIsOpen(false)}
  //               src={`${
  //                 process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
  //                   ? process.env.NEXT_PUBLIC_BASE_PATH
  //                   : ''
  //               }/images/lateralNavBar/nav.svg`}
  //               alt="image"
  //               className="cursor-pointer transition-transform duration-300"
  //             />
  //             <a
  //               href={`${
  //                 process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
  //                   ? `/xnode/`
  //                   : '/'
  //               }`}
  //               className="absolute -top-[8px] left-[15px] flex w-[50px] cursor-pointer flex-col items-center md:-top-[9.6px] md:left-[30px] md:w-[60px] lg:-top-[11.2px]  lg:left-[35px] lg:w-[70px] xl:-top-[12.8px] xl:left-[40px] xl:w-[80px] 2xl:-top-[16px] 2xl:left-[50px] 2xl:w-[100px] "
  //             >
  //               <img
  //                 src={`${
  //                   process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
  //                     ? process.env.NEXT_PUBLIC_BASE_PATH
  //                     : ''
  //                 }/images/logo/xnode-new-logo.svg`}
  //                 alt="image"
  //                 className="w-[40px] md:w-[80px] lg:w-[120px] xl:w-[160px] 2xl:w-[200px]"
  //               />
  //             </a>
  //           </div>
  //         </div>
  //         {sideBarOptions.map((option, index) => (
  //           <div
  //             key={index}
  //             onMouseEnter={() => handleButtonHover(option.title)}
  //             onClick={() => {
  //               handleButtonClick(option.title)
  //               window.scrollTo({ top: 0, behavior: 'smooth' })
  //             }}
  //             className={`relative flex w-full flex-row items-center justify-between gap-[7.5px] px-[13px] py-[10px] md:gap-[9px] md:px-[20px]  md:py-[12px]  lg:gap-[10.5px] lg:px-[23px] lg:py-[14px] xl:gap-[12px] xl:px-[26.4px] xl:py-[16px] 2xl:gap-[15px] 2xl:px-[33px]  2xl:py-[20px] ${
  //               // !next &&
  //               // !nextFromScratch &&
  //               // option.title !== 'Home' && option.title !== 'Workspace' && !user
  //               //   ? 'w-full opacity-50 hover:bg-[#fff]':
  //               'cursor-pointer hover:bg-[#F4F4F4]'
  //             } ${selectionSideNavBar === option.title ? 'bg-[#F4F4F4]' : ''}`}
  //           >
  //             <img
  //               src={`${
  //                 process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
  //                   ? process.env.NEXT_PUBLIC_BASE_PATH
  //                   : ''
  //               }${option.icon}`}
  //               alt="image"
  //               className={`${option.iconStyle}  mx-auto`}
  //             />
  //             {option.title === 'Home' && (
  //               <img
  //                 src={`${
  //                   process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
  //                     ? process.env.NEXT_PUBLIC_BASE_PATH
  //                     : ''
  //                 }/images/lateralNavBar/green-ellipse.svg`}
  //                 alt="green dot"
  //                 style={{ opacity: greenDotOpacity }}
  //                 className="absolute right-2 top-2 h-3 w-3 transition-opacity duration-500"
  //               />
  //             )}
  //             <div className=" flex w-full items-center text-start font-inter text-[9px] font-medium !-tracking-[2%] text-[#000]  md:text-[8.4px] lg:text-[10px] xl:text-[11.2px]  2xl:text-[14px] 2xl:!leading-[19px]">
  //               {option.title}
  //             </div>
  //             <img
  //               src={`${
  //                 process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
  //                   ? process.env.NEXT_PUBLIC_BASE_PATH
  //                   : ''
  //               }/images/lateralNavBar/new-arrow.svg`}
  //               alt="image"
  //               className={` ${
  //                 option.title === 'Home' ||
  //                 option.title === 'Dashboard' ||
  //                 option.title === 'Workspace' ||
  //                 option.title === 'Templates'
  //                   ? 'hidden'
  //                   : ''
  //               } absolute left-[7px] top-[12.5px] w-[4px] md:left-[10.2px] md:top-[15px] md:w-[4.8px] lg:left-[12px] lg:top-[17.5px] lg:w-[5.6px] xl:left-[13.6px] xl:top-[20px] xl:w-[6.4px] 2xl:left-[17px] 2xl:top-[25px] 2xl:w-[8px]`}
  //             />
  //           </div>
  //         ))}
  //         {hoveredIcon === 'Data' && (
  //           <div className="absolute right-0 top-[80px] translate-x-[100%] transform">
  //             <SubBarData onValueChange={console.log('')} />
  //           </div>
  //         )}
  //       </div>

  //       {hoveredIcon === 'Servers' && (
  //         <div className="absolute right-0 top-[80px] translate-x-[100%] transform">
  //           <SubBarServers onValueChange={console.log('')} />
  //         </div>
  //       )}
  //       {hoveredIcon === 'APIs' && (
  //         <div className="absolute right-0 top-[80px] translate-x-[100%] transform">
  //           <SubBarAPIs onValueChange={console.log('')} />
  //         </div>
  //       )}
  //       {hoveredIcon === 'Analytics' && (
  //         <div
  //           onMouseLeave={() => setHoveredIcon(null)}
  //           className="absolute right-0 top-[80px] translate-x-[100%] transform"
  //         >
  //           <SubBarAnalytics onValueChange={console.log('')} />
  //         </div>
  //       )}
  //       {hoveredIcon === 'RPC' && (
  //         <div
  //           onMouseLeave={() => setHoveredIcon(null)}
  //           className="absolute right-0 top-[80px] translate-x-[100%] transform"
  //         >
  //           <SubBarRPC onValueChange={console.log('')} />
  //         </div>
  //       )}
  //       {hoveredIcon === 'ML/LLMs' && (
  //         <div
  //           onMouseLeave={() => setHoveredIcon(null)}
  //           className="absolute right-0 top-[80px] translate-x-[100%] transform"
  //         >
  //           <SubBarML onValueChange={console.log('')} />
  //         </div>
  //       )}
  //       {hoveredIcon === 'Storage' && (
  //         <div
  //           onMouseLeave={() => setHoveredIcon(null)}
  //           className="absolute right-0 top-[80px] translate-x-[100%] transform"
  //         >
  //           <SubBarStorage onValueChange={console.log('')} />
  //         </div>
  //       )}
  //       {hoveredIcon === 'Data management' && (
  //         <div
  //           onMouseLeave={() => setHoveredIcon(null)}
  //           className="absolute right-0 top-[80px] translate-x-[100%] transform"
  //         >
  //           <SubBarDataManagement onValueChange={console.log('')} />
  //         </div>
  //       )}
  //       {hoveredIcon === 'Compute' && (
  //         <div
  //           onMouseLeave={() => setHoveredIcon(null)}
  //           className="absolute right-0 top-[80px] translate-x-[100%] transform"
  //         >
  //           <SubBarCompute onValueChange={console.log('')} />
  //         </div>
  //       )}
  //       {hoveredIcon === 'Trading' && (
  //         <div
  //           onMouseLeave={() => setHoveredIcon(null)}
  //           className="absolute right-0 top-[80px] translate-x-[100%]"
  //         >
  //           <SubBarTrading onValueChange={console.log('')} />
  //         </div>
  //       )}
  //       {hoveredIcon === 'Utility' ? (
  //         <div className="absolute right-0 top-[80px] translate-x-[100%] transform">
  //           <SubBarUtility onValueChange={console.log('')} />
  //         </div>
  //       ) : null}
  //     </div>
  //   </>
  // )
}

export default LateralNav

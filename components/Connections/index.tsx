import { useState } from 'react'

import NextStep from './NextStep'

/* eslint-disable react/no-unescaped-entities */
const Connections = () => {
  const [nextStep, setNextStep] = useState<boolean>(false)

  const options = [
    {
      isOpen: true,
      image: '/images/connections/first.svg',
      icon: '2xl:w-[325px] xl:w-[260px]',
    },
    {
      isOpen: true,
      image: '/images/dataset/equinix2.svg',
      icon: '2xl:w-[298px] xl:w-[238px]',
    },
    {
      isOpen: false,
      image: '/images/connections/third.svg',
      icon: '2xl:w-[365px] xl:w-[292px]',
    },
    {
      isOpen: true,
      image: '/images/connections/fourth.svg',
      icon: '2xl:w-[305px] xl:w-[244px]',
    },
  ]

  if (nextStep) {
    return (
      <>
        <NextStep />
      </>
    )
  }

  return (
    <>
      <section
        id="home"
        className={`w-full bg-[#F9F9F9] px-[48px] pb-[1000px] pt-[88px] 2xl:px-[60px] 2xl:pt-[110px]`}
      >
        <div className="grid grid-cols-3 2xl:gap-x-[64px] 2xl:gap-y-[72px]">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex w-[324px] justify-center rounded-[10px] bg-white 2xl:w-[405px]"
            >
              <div>
                {' '}
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }${option.image}`}
                  alt="image"
                  className={`${option.icon} xl:mt-[30px] 2xl:mt-[38px]`}
                />
                {option.isOpen ? (
                  <div className="mx-auto mt-[41px] flex h-fit cursor-pointer justify-center gap-x-[8px] rounded-[5px] bg-[#0354EC] px-[11px] py-[6.2px] text-center text-[7px] font-medium text-[#fff] hover:bg-[#0e2e69] md:mt-[49px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:mt-[57px] lg:px-[14.5px] lg:py-[8.75px] lg:text-[10px] xl:mb-[56px] xl:mt-[65px] xl:px-[17px] xl:py-[10px] xl:text-[11.2px] 2xl:mb-[70px] 2xl:mt-[82px] 2xl:gap-x-[10px] 2xl:px-[21px] 2xl:py-[12.5px] 2xl:text-[14px]">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/header/storm.svg`}
                      alt="image"
                      className={`w-[5px] md:w-[6px] lg:w-[7px] xl:w-[8px] 2xl:w-[10px]`}
                    />
                    <div
                      onClick={() => {
                        setNextStep(true)
                      }}
                    >
                      Perform the connection
                    </div>
                  </div>
                ) : (
                  <div className="mt-[41px] flex h-fit justify-center gap-x-[8px] rounded-[5px] bg-[#9A9A9A] px-[11px] py-[6.2px] text-center text-[7px] font-medium text-[#fff] md:mt-[49px] md:px-[12.5px] md:py-[7.5px] md:text-[8.4px] lg:mt-[57px] lg:px-[14.5px] lg:py-[8.75px] lg:text-[10px] xl:mb-[56px] xl:mt-[65px] xl:px-[17px] xl:py-[10px] xl:text-[11.2px] 2xl:mb-[70px] 2xl:mt-[82px] 2xl:gap-x-[10px] 2xl:px-[21px] 2xl:py-[12.5px] 2xl:text-[14px]">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/header/storm.svg`}
                      alt="image"
                      className={`w-[5px] md:w-[6px] lg:w-[7px] xl:w-[8px] 2xl:w-[10px]`}
                    />
                    <div>Disconnect the connection</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Connections

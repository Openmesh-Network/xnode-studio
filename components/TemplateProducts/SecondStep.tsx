/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'

/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react'

import 'react-toastify/dist/ReactToastify.css'

import { AccountContext } from '@/contexts/AccountContext'

import { TemplatesProducts } from '@/types/dataProvider'

const Configuration = () => {
  const [templates, setTemplates] = useState<TemplatesProducts[]>([])
  const [page, setPage] = useState<number>(1)
  const [searchInput, setSearchInput] = useState<string>()
  const [freeSpace, setFreeSpace] = useState<number>(600)
  const [includedServices, setIncludeServices] = useState<any>({})
  const [addPythiaToDeployment, setAddPythiaToDeployment] =
    useState<boolean>(false)

  const { templateSelected, setIndexerDeployerStep } =
    useContext(AccountContext)

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  useEffect(() => {
    if (
      templateSelected?.storageTotal &&
      Number(templateSelected.storageTotal) > 0
    ) {
      const freeSpace = Number(templateSelected.storageTotal) - 40 - 33
      setFreeSpace(freeSpace)
    }
  }, [templateSelected])

  return (
    <section className="relative z-10 pt-[30px] lg:pt-0">
      <div className="mx-auto max-w-[1380px] pl-[85px] text-[14px] font-normal text-[#000]">
        <div className="flex justify-between gap-x-[50px]">
          <div className="pb-[50px] pt-[44px]">
            <div className="mb-[12.5px] text-[48px] font-semibold leading-[64px] tracking-[-1.9px]">
              Choose your configuration
            </div>
            <div className="pt-[40.5px]">
              <div className="">
                <div className="flex h-[25px] w-[570px]">
                  <div
                    style={{ width: `${(40 / (40 + 33 + freeSpace)) * 100}%` }}
                    className={`mr-[2px] rounded-l-[8px] bg-[#000]`}
                  ></div>
                  <div
                    style={{ width: `${(33 / (40 + 33 + freeSpace)) * 100}%` }}
                    className={`bg-[#0059ff]`}
                  ></div>
                  <div
                    style={{
                      width: `${(freeSpace / (40 + 33 + freeSpace)) * 100}%`,
                    }}
                    className={`flex items-center justify-center rounded-r-[8px] bg-gray200 text-[12px] font-light`}
                  >
                    available to rent and get paid
                  </div>
                </div>
                <div className="mt-[13.63px] flex w-fit justify-between gap-x-[15px]">
                  <div className="flex items-center gap-x-[8px]">
                    <div className="size-[13px] rounded-full bg-[#000]"></div>
                    <div className="text-[16px] font-normal">
                      Openmesh core (40 GB)
                    </div>
                  </div>
                  <div className="flex items-center gap-x-[8px]">
                    <div className="size-[13px] rounded-full bg-[#0059ff]"></div>
                    <div className="text-[16px] font-normal">
                      Your services (33 GB){' '}
                    </div>
                  </div>
                  <div className="flex items-center gap-x-[8px]">
                    <div className="size-[13px] rounded-full bg-gray200"></div>
                    <div className="text-[16px] font-normal">
                      Free ({freeSpace} GB){' '}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-[38px] w-full max-w-[808px]">
                <div className="text-[18px] font-semibold !leading-[36px]">
                  Review and build your solution
                </div>
                <div className="mt-[8px] flex bg-[#d1d5db] px-[24px] py-[12px] text-[16px] font-normal !leading-[24px]">
                  <div className="w-full max-w-[283px]">Steps</div>
                  <div className="w-full max-w-[406px]">Description</div>
                  <div>Edit</div>
                </div>
                <div className="mt-[8px] flex rounded-[12px] bg-[#fff] px-[24px] py-[36px] text-[16px] font-semibold !leading-[24px]">
                  <div className="w-full max-w-[283px] text-[#0059ff]">
                    1. Select cloud provider
                  </div>
                  <div className="w-full max-w-[406px]">
                    {templateSelected?.providerName}
                  </div>
                  <img
                    onClick={() => {
                      setIndexerDeployerStep(0)
                    }}
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/arrow-right-2.svg`}
                    alt="image"
                    className="cursor-pointer"
                  />
                </div>
                <div className="mt-[8px] flex rounded-[12px] bg-[#fafafa] px-[24px] py-[36px] text-[16px] font-semibold !leading-[24px]">
                  <div className="w-full max-w-[283px] text-[#0059ff]">
                    2. Select service region
                  </div>
                  <div className="w-full max-w-[406px]">
                    {templateSelected?.location}
                  </div>
                  <img
                    onClick={() => {
                      setIndexerDeployerStep(0)
                    }}
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/arrow-right-2.svg`}
                    alt="image"
                    className="cursor-pointer"
                  />
                </div>
                <div className="mt-[8px] flex rounded-[12px] bg-[#fff] px-[24px] py-[36px] text-[16px] font-semibold !leading-[24px]">
                  <div className="w-full max-w-[283px] text-[#0059ff]">
                    3. Select latency preference
                  </div>
                  <div className="w-full max-w-[406px]">
                    {templateSelected?.availability}
                  </div>
                  <img
                    onClick={() => {
                      setIndexerDeployerStep(0)
                    }}
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/arrow-right-2.svg`}
                    alt="image"
                    className="cursor-pointer"
                  />
                </div>
                <div className="mt-[8px] rounded-[12px] bg-[#fafafa] px-[24px] py-[36px] text-[16px] font-semibold !leading-[24px]">
                  <div className="flex">
                    <div className="w-full max-w-[283px] text-[#0059ff]">
                      4. Usecase
                    </div>
                    <div className="w-full max-w-[406px]">
                      Building a decentralized data infrastructure
                    </div>
                    <img
                      onClick={() => {
                        setIndexerDeployerStep(0)
                      }}
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/arrow-right-2.svg`}
                      alt="image"
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="pl-[25px] text-[14px] font-normal text-[#ABABAB]">
                    Included Services
                  </div>
                  <div className="mt-[11px] flex gap-x-px pl-[72px]">
                    <div className="h-[346px] w-px bg-[#C3C1C1]"></div>
                    <div className="w-full">
                      <div className="mt-[22px] flex items-start">
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }/images/template/arrow-end-circle.svg`}
                          alt="image"
                          className="mr-[10px] pt-[12px]"
                        />
                        <div className="w-full max-w-[590px]">
                          <div className="text-[16px] font-semibold text-[#313131]">
                            Kubernetes
                          </div>
                          <div className="mt-[3px] text-[12px] font-normal text-[#505050]">
                            Automating deployment, scaling, and management of
                            containerized applications
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            const obj = { ...includedServices }
                            obj['kubernetes'] = !obj['kubernetes']
                            setIncludeServices(obj)
                          }}
                          className={`flex size-[16px] cursor-pointer rounded-[5px] ${
                            includedServices?.kubernetes
                              ? 'bg-[#0059ff]'
                              : 'bg-[#929292]'
                          }`}
                        >
                          <img
                            src={`${
                              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                ? process.env.NEXT_PUBLIC_BASE_PATH
                                : ''
                            }/images/template/check-white.svg`}
                            alt="image"
                            className="m-auto"
                          />
                        </div>
                      </div>
                      <div className="mt-[26px] flex items-start">
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }/images/template/arrow-end-circle.svg`}
                          alt="image"
                          className="mr-[10px] pt-[12px]"
                        />
                        <div className="w-full max-w-[590px]">
                          <div className="text-[16px] font-semibold text-[#313131]">
                            Openmesh Consensus{' '}
                          </div>
                          <div className="mt-[3px] text-[12px] font-normal text-[#505050]">
                            Automating deployment, scaling, and management of
                            containerized applications
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            const obj = { ...includedServices }
                            obj['openmeshConsensus'] = !obj['openmeshConsensus']
                            setIncludeServices(obj)
                          }}
                          className={`flex size-[16px] cursor-pointer rounded-[5px] ${
                            includedServices?.openmeshConsensus
                              ? 'bg-[#0059ff]'
                              : 'bg-[#929292]'
                          }`}
                        >
                          <img
                            src={`${
                              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                ? process.env.NEXT_PUBLIC_BASE_PATH
                                : ''
                            }/images/template/check-white.svg`}
                            alt="image"
                            className="m-auto"
                          />
                        </div>
                      </div>
                      <div className="mt-[26px] flex items-start">
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }/images/template/arrow-end-circle.svg`}
                          alt="image"
                          className="mr-[10px] pt-[12px]"
                        />
                        <div className="w-full max-w-[590px]">
                          <div className="text-[16px] font-semibold text-[#313131]">
                            BitTorrent Protocol Client{' '}
                          </div>
                          <div className="mt-[3px] text-[12px] font-normal text-[#505050]">
                            Automating deployment, scaling, and management of
                            containerized applications
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            const obj = { ...includedServices }
                            obj['bittorrent'] = !obj['bittorrent']
                            setIncludeServices(obj)
                          }}
                          className={`flex size-[16px] cursor-pointer rounded-[5px] ${
                            includedServices?.bittorrent
                              ? 'bg-[#0059ff]'
                              : 'bg-[#929292]'
                          }`}
                        >
                          <img
                            src={`${
                              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                ? process.env.NEXT_PUBLIC_BASE_PATH
                                : ''
                            }/images/template/check-white.svg`}
                            alt="image"
                            className="m-auto"
                          />
                        </div>
                      </div>
                      <div className="mt-[26px] flex items-start">
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }/images/template/arrow-end-circle.svg`}
                          alt="image"
                          className="mr-[10px] pt-[12px]"
                        />
                        <div className="w-full max-w-[590px]">
                          <div className="text-[16px] font-semibold text-[#313131]">
                            Phytia Pro{' '}
                          </div>
                          <div className="mt-[3px] text-[12px] font-normal text-[#505050]">
                            Automating deployment, scaling, and management of
                            containerized applications
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            const obj = { ...includedServices }
                            obj['phytiaPro'] = !obj['phytiaPro']
                            setIncludeServices(obj)
                          }}
                          className={`flex size-[16px] cursor-pointer rounded-[5px] ${
                            includedServices?.phytiaPro
                              ? 'bg-[#0059ff]'
                              : 'bg-[#929292]'
                          }`}
                        >
                          <img
                            src={`${
                              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                ? process.env.NEXT_PUBLIC_BASE_PATH
                                : ''
                            }/images/template/check-white.svg`}
                            alt="image"
                            className="m-auto"
                          />
                        </div>
                      </div>
                      <div className="mt-[26px] flex items-start">
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }/images/template/arrow-end-circle.svg`}
                          alt="image"
                          className="mr-[10px] pt-[12px]"
                        />
                        <div className="w-full max-w-[590px]">
                          <div className="text-[16px] font-semibold text-[#313131]">
                            APIs & Connectivity{' '}
                          </div>
                          <div className="mt-[3px] text-[12px] font-normal text-[#505050]">
                            Automating deployment, scaling, and management of
                            containerized applications
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            const obj = { ...includedServices }
                            obj['apiConnectivity'] = !obj['apiConnectivity']
                            setIncludeServices(obj)
                          }}
                          className={`flex size-[16px] cursor-pointer rounded-[5px] ${
                            includedServices?.apiConnectivity
                              ? 'bg-[#0059ff]'
                              : 'bg-[#929292]'
                          }`}
                        >
                          <img
                            src={`${
                              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                ? process.env.NEXT_PUBLIC_BASE_PATH
                                : ''
                            }/images/template/check-white.svg`}
                            alt="image"
                            className="m-auto"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[10px] w-full border-[0.6px] border-[#d1d5da] bg-[#fafafa] py-[10px] lg:mb-0 lg:w-[386px] lg:py-[32px]">
            <div className="flex justify-between px-[32px]">
              <div className="text-[18px] font-bold leading-[40px]">
                Your progress
              </div>
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/template/x-new.svg`}
                alt="image"
                className={``}
              />
            </div>
            <div className="mt-[22px] flex items-center gap-x-[20px] px-[32px] py-[10px]">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/template/circle-dashed-complete.svg`}
                alt="image"
                className={``}
              />
              <div className="text-[16px] font-semibold leading-[36px] text-[#959595]">
                Select a template
              </div>
            </div>
            <div className="mt-[31px] flex items-center gap-x-[20px] px-[32px] py-[10px]">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/template/circle-dashed-complete.svg`}
                alt="image"
                className={``}
              />
              <div className="text-[16px] font-semibold leading-[36px] text-[#959595]">
                Select a provider
              </div>
            </div>
            <div className="mt-[31px] flex items-center gap-x-[20px] border-l-[3px] border-[#0354EC] bg-gray200 px-[32px] py-[10px]">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/template/circled-dashed.svg`}
                alt="image"
                className={``}
              />
              <div className="text-[16px] font-semibold leading-[36px] text-[#000]">
                Choose your configuration
              </div>
            </div>
            <div className="ml-[92px] mt-[17px]">
              <div className="border-b border-[#fafafa] pb-[5px]">
                <div className="text-[14px] font-medium text-[#959595]">
                  Service
                </div>
                <div className="mt-[5px] text-[16px] font-bold text-[#4d4d4d]">
                  Xnode
                </div>
              </div>
              <div className="mt-[10px] border-b border-[#fafafa] pb-[5px]">
                <div className="text-[14px] font-medium text-[#959595]">
                  Cloud
                </div>
                <div className="mt-[5px] text-[16px] font-bold text-[#4d4d4d]">
                  {templateSelected?.providerName}
                </div>
              </div>
              <div className="mt-[10px] border-b border-[#fafafa] pb-[5px]">
                <div className="text-[14px] font-medium text-[#959595]">
                  Region
                </div>
                <div className="mt-[5px] text-[16px] font-bold text-[#4d4d4d]">
                  {templateSelected?.location}
                </div>
              </div>
              <div className="mt-[10px] border-b border-[#fafafa] pb-[5px]">
                <div className="text-[14px] font-medium text-[#959595]">
                  Latency
                </div>
                <div className="mt-[5px] text-[16px] font-bold text-[#4d4d4d]">
                  {templateSelected?.availability}
                </div>
              </div>
              <div className="mt-[10px] border-b border-[#fafafa] pb-[5px]">
                <div className="text-[14px] font-medium text-[#959595]">
                  Database
                </div>
                <div className="mt-[5px] text-[16px] font-bold text-[#4d4d4d]">
                  PostgreSQL{' '}
                </div>
              </div>
              <div className="mt-[10px] border-b border-[#fafafa] pb-[5px]">
                <div className="text-[14px] font-medium text-[#959595]">
                  Data sources
                </div>
                <div className="mt-[5px] text-[16px] font-bold text-[#4d4d4d]">
                  Off-chain data
                </div>
                <ul>
                  <li className="ml-[17px] list-disc text-[14px] font-medium text-[#4d4d4d]">
                    Apollox{' '}
                  </li>
                  <li className="ml-[17px] list-disc text-[14px] font-medium text-[#4d4d4d]">
                    Binance{' '}
                  </li>
                </ul>
                <div className="text-[16px] font-bold text-[#4d4d4d]">
                  On-chain data{' '}
                </div>
                <ul>
                  <li className="ml-[17px] list-disc text-[14px] font-medium text-[#4d4d4d]">
                    Ethereum{' '}
                  </li>
                </ul>
              </div>
              <div className="mt-[10px] border-b border-[#fafafa] pb-[5px]">
                <div className="text-[14px] font-medium text-[#959595]">
                  Add-ons
                </div>
                <div className="mt-[5px] text-[16px] font-bold text-[#4d4d4d]">
                  Unified API{' '}
                </div>
              </div>
              <div className="mt-[25px]">
                <div className="text-[18px] font-medium">No. of servers</div>
                <div className="text-[18px] font-bold text-[#0059ff]">
                  2 x small servers
                </div>
              </div>
              <div className="mt-[18px]">
                <div className="text-[18px] font-medium">
                  Estimated monthly price*
                </div>
                <div className="text-[18px] font-bold text-[#0059ff]">
                  {templateSelected?.priceMonth} / month{' '}
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
                setIndexerDeployerStep(2)
              }}
              className="mx-auto mt-[30px] w-fit cursor-pointer rounded-[12px] bg-[#0059ff] px-[50px] py-[15px] text-center text-[16px] font-bold leading-[22px] text-[#fff] hover:bg-[#014cd7]"
            >
              Create service and deploy
            </div>
            <div className="mt-[39px] flex items-center gap-x-[20px] px-[32px] py-[10px]">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/template/circled-dashed-gray.svg`}
                alt="image"
                className={``}
              />
              <div className="text-[16px] font-semibold leading-[36px] text-[#959595]">
                Performing connection
              </div>
            </div>
            <div className="mt-[39px] flex items-center gap-x-[20px] px-[32px] py-[10px]">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/template/circled-dashed-gray.svg`}
                alt="image"
                className={``}
              />
              <div className="text-[16px] font-semibold leading-[36px] text-[#959595]">
                Service deployed
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Configuration

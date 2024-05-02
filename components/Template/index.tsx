/* eslint-disable @next/next/no-img-element */
/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState, ChangeEvent, FC, useContext } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Eye, EyeSlash } from 'phosphor-react'
import * as Yup from 'yup'
import axios from 'axios'
import Checkbox from '@material-ui/core/Checkbox'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-quill/dist/quill.snow.css' // import styles
import 'react-datepicker/dist/react-datepicker.css'
import { getData } from '@/utils/data'
import { DataProvider } from '@/types/dataProvider'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { format } from 'sql-formatter'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import { formatDistanceToNow, differenceInDays } from 'date-fns'
import { AccountContext } from '@/contexts/AccountContext'

const Template = (id: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState<DataProvider>()
  const [tasksSearchBar, setTasksSearchBar] = useState('')
  const { user, setUser } = useContext(AccountContext)

  const { push } = useRouter()

  return (
    <>
      <section className="relative z-10 pt-[30px] lg:pt-0">
        <div className="mx-auto max-w-[1380px] pl-[85px]  text-[14px] font-normal text-[#000]">
          <div className="justify-between gap-x-[50px] lg:flex">
            <div className="mt-[60px] pb-[20px] lg:pb-[300px]">
              <div className="flex justify-between gap-x-[10px]">
                <div className="flex items-center gap-x-[9px]">
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/line.svg`}
                    alt="image"
                    className={`w-[48px]`}
                  />
                  <div className="text-[48px] font-semibold leading-[64px]">
                    Ethereum RPC Node
                  </div>
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/check.svg`}
                    alt="image"
                    className={`w-[20px]`}
                  />
                </div>
                <div
                  onClick={() => {
                    push(
                      `${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? `/xnode/template-products`
                          : `template-products`
                      }`,
                    )
                  }}
                  className="h-fit cursor-pointer text-[16px] font-normal text-[#0354EC] underline underline-offset-2 hover:text-[#014cd7]"
                >
                  Edit
                </div>
              </div>

              <div className="ml-[10px] mt-[24px]">
                <div className="text-[12px] text-[#0354EC] ">
                  <span className="underline underline-offset-2">
                    RPC Nodes
                  </span>
                  ,{' '}
                  <span className="underline underline-offset-2">
                    Web3 Infrastructure
                  </span>
                  ,{' '}
                  <span className="underline underline-offset-2">
                    Blockchain Apps
                  </span>
                </div>
                <div className="mt-[23px] max-w-[735px] text-[16px] leading-[22px]">
                  For this purpose, every Ethereum client implements a JSON-RPC
                  specific ation(opens in a new tab), so there is a uniform set
                  of methods that applications can rely on regardless of the
                  specific node or client implementation.
                </div>
                <div className="mt-[40px] max-w-[703px] text-[10px] md:text-[14px] lg:mt-[59px]">
                  <div className="text-[18px] font-semibold">
                    System requirements
                  </div>
                  <div className="mt-[15px] flex gap-x-[30px] border-[0.7px] border-[#CDCDCD] py-[8px] px-[20px] font-medium lg:gap-x-0">
                    <div className="md:w-[40%] lg:w-[50%]">
                      Min requirements
                    </div>
                    <div className="lg:w-[50%]">Recommended requirements</div>
                  </div>
                  <div className="mt-[15px] flex gap-x-[10px] px-[20px] font-normal lg:gap-x-0">
                    <div className="lg:mr-[64px] lg:w-[70%]">
                      CPU, 8-Core (16-Thread), RAM, 12GB DDR4 ; Storage, 500GB
                      SSD
                    </div>
                    <div>
                      Intel i7/Xeon or equivalent with AVX support ; RAM, 12GB
                      DDR4 ; Storage, 500GB SSD
                    </div>
                  </div>
                  <div className="mt-[30px] border-b-[1px] border-[#DDDDDD]"></div>
                </div>
                <div className="mt-[40px] max-w-[703px] text-[10px] md:text-[14px] lg:mt-[59px]">
                  <div className="text-[18px] font-semibold">
                    What’s included{' '}
                  </div>
                  <div className="mt-[15px] flex border-[0.7px] border-[#CDCDCD] py-[8px] px-[5px] font-medium lg:px-[20px] ">
                    <div className="w-[30%]">Product Name</div>
                    <div className="w-[30%]">Description</div>
                    <div className="w-[25%]">Tags</div>
                    <div className="w-[15%]">Infra ID</div>
                  </div>
                  <div className="mt-[15px] flex px-[20px] font-normal">
                    <div className="w-[30%]">Ethereum node core</div>
                    <div className="w-[30%]">CPU, 8-Core (16-Thread) </div>
                    <div className="w-[25%]">Bare metal </div>
                    <div className="w-[15%]">#26343</div>
                  </div>
                  <div className="mt-[8px] border-b-[1px] border-[#DDDDDD]"></div>
                  <div className="mt-[8px] flex px-[20px] font-normal">
                    <div className="w-[30%]">Ethereum node core</div>
                    <div className="w-[30%]">CPU, 8-Core (16-Thread) </div>
                    <div className="w-[25%]">Bare metal </div>
                    <div className="w-[15%]">#26343</div>
                  </div>
                  <div className="mt-[8px] border-b-[1px] border-[#DDDDDD]"></div>
                </div>
                <div className="mt-[50px] max-w-[703px] lg:mt-[62px]">
                  <div className="text-[18px] font-semibold">
                    Technical diagrams{' '}
                  </div>
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/dash.png`}
                    alt="image"
                    className={`mt-[22px]`}
                  />
                </div>
              </div>
            </div>
            <div className="mt-[10px] w-full border-[0.6px] border-[#d1d5da] py-[10px] lg:mb-0 lg:w-[386px] lg:py-[32px]">
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
              <div className="mt-[22px] flex items-center gap-x-[20px] border-l-[3px] border-[#0354EC] bg-[#e5eefc] py-[10px] px-[32px]">
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
                  Select a template
                </div>
              </div>
              <div className="mx-[79px] mt-[28px]">
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }/images/template/bare-metal.svg`}
                  alt="image"
                  className={``}
                />
              </div>
              <div className="ml-[92px] mt-[26px]">
                <div className="text-[16px] font-medium text-[#000]">
                  Starting from{' '}
                  <span className="text-[#0354EC] line-through">$14.31 pm</span>
                </div>
                <div className="text-[16px] font-bold text-[#0354EC]">
                  $1,475.43 Monthly savings{' '}
                </div>
              </div>
              <div className="mx-auto mt-[27px] w-fit cursor-pointer rounded-[12px] bg-[#0354EC] px-[133px] py-[15px] text-[16px] font-bold text-[#fff] hover:bg-[#014cd7]">
                Select
              </div>
              <div className="mt-[39px] flex items-center gap-x-[20px] py-[10px] px-[32px]">
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
                  Select a provider
                </div>
              </div>
              <div className="mt-[39px] flex items-center gap-x-[20px] py-[10px] px-[32px]">
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
                  Choose your configuration
                </div>
              </div>
              <div className="mt-[39px] flex items-center gap-x-[20px] py-[10px] px-[32px]">
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
              <div className="mt-[39px] flex items-center gap-x-[20px] py-[10px] px-[32px]">
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
    </>
  )
}

export default Template

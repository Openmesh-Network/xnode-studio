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
import { getAPI, getData } from '@/utils/data'
import { DataProvider, TemplatesData } from '@/types/dataProvider'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { format } from 'sql-formatter'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import { formatDistanceToNow, differenceInDays } from 'date-fns'
import { AccountContext } from '@/contexts/AccountContext'

const Template = (id: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setTemplateData] = useState<TemplatesData>()
  const {
    user,
    setUser,
    setIndexerDeployerStep,
    templateDataSelected,
    setTemplateDataSelected,
  } = useContext(AccountContext)

  const { push } = useRouter()

  async function getData(id: any) {
    setIsLoading(true)

    console.log('o id q vai chamar')
    console.log(id)
    const url = `/openmesh-data/functions/getTemplateData?id=${id.id}`

    let data: TemplatesData
    try {
      data = await getAPI(url)
      console.log('recebi dados')
    } catch (err) {
      toast.error('Something occured')
    }

    console.log(data)
    if (data.category === 'scratch') {
      data.name = ''
      data.description = ''
      data.productsIncluded = [
        { name: 'Ethereum', description: 'Blockchain node', tags: 'Web3' },
        {
          name: 'Google BigQuery',
          description: 'Data analytics',
          tags: 'Analytics',
        },
      ]
    }
    setTemplateData(data)
    setIsLoading(false)
  }

  function gerarNumeroAleatorio() {
    return Math.floor(1000 + Math.random() * 9000)
  }

  useEffect(() => {
    setIsLoading(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    if (id) {
      getData(id.id)
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="mx-auto mt-[100px] flex w-fit gap-x-[90px] text-center">
        <div className="h-[100px] w-[800px] animate-pulse bg-[#e5e5e5]"></div>
        <div className="h-[100px] w-[200px] animate-pulse bg-[#e5e5e5]"></div>
      </div>
    )
  }

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
                  <input
                    value={data?.name}
                    placeholder="Input a name"
                    onChange={(e) => {
                      if (e.target.value.length < 1000) {
                        const newData = { ...data }
                        newData.name = e.target.value
                        setTemplateData(newData)
                      }
                    }}
                    className="w-full bg-[#fff] text-[48px] font-semibold leading-[64px] placeholder:text-[#6B7280]"
                  />
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
                <div className="flex gap-x-[4px] text-[12px] text-[#0354EC]">
                  {data?.tags?.map((item, index) => (
                    <div key={index} className="underline underline-offset-2">
                      {item},
                    </div>
                  ))}
                </div>
                <textarea
                  value={data?.description}
                  placeholder="Input a description"
                  onChange={(e) => {
                    if (e.target.value.length < 1000) {
                      const newData = { ...data }
                      newData.description = e.target.value
                      setTemplateData(newData)
                    }
                  }}
                  className="mt-[23px] h-[100px] max-h-[100px] w-full  max-w-[735px] bg-[#fff] text-[16px] leading-[22px] placeholder:text-[#6B7280]"
                />
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
                    <div className="lg:w-[50%]">
                      {data?.systemMinRequirements}
                    </div>
                    <div>{data?.systemRecommendedRequirements}</div>
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
                    <div className="w-[30%] max-w-[30%] overflow-hidden">
                      Core
                    </div>
                    <div className="w-[30%]">
                      500MB ram, 1 cpu, 10GB storage
                    </div>
                    <div className="w-[25%]">Bare metal </div>
                    <div className="w-[15%]">#1</div>
                  </div>
                  {data?.productsIncluded && (
                    <div>
                      {data?.productsIncluded?.map((item, index) => (
                        <div key={index}>
                          <div className="mt-[8px] border-b-[1px] border-[#DDDDDD]"></div>
                          <div className="mt-[8px] flex px-[20px] font-normal">
                            <div className="w-[30%] max-w-[30%] overflow-hidden">
                              {item?.name}
                            </div>
                            <div className="w-[30%]">
                              {item.name === 'Google BigQuery'
                                ? 'Analytics'
                                : 'CPU, 8-Core (16-Thread)'}
                            </div>
                            <div className="w-[25%]">{item?.tags}</div>
                            <div className="w-[15%]">
                              #{gerarNumeroAleatorio()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-[8px] border-b-[1px] border-[#DDDDDD]"></div>
                  <div className="mt-[8px] flex px-[20px] font-normal">
                    <div className="w-[30%] max-w-[30%] overflow-hidden">
                      {data?.name}
                    </div>
                    <div className="w-[30%]">CPU, 8-Core (16-Thread)</div>
                    <div className="w-[25%]">Bare metal </div>
                    <div className="w-[15%]">#{gerarNumeroAleatorio()}</div>
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
                  <span className="text-[#0354EC] line-through">
                    ${data?.price} /mo
                  </span>
                </div>
                <div className="text-[16px] font-bold text-[#0354EC]">
                  $1,475.43 Monthly savings{' '}
                </div>
              </div>
              <div
                onClick={() => {
                  if (data?.name?.length > 0) {
                    setIndexerDeployerStep(0)
                  }
                }}
                className={`mx-auto mt-[27px] w-fit ${
                  data?.name?.length > 0 && 'cursor-pointer'
                }  rounded-[12px] bg-[#0354EC] px-[133px] py-[15px] text-[16px] font-bold text-[#fff] hover:bg-[#014cd7]`}
              >
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

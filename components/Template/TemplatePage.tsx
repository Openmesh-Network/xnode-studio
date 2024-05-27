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
import 'react-toastify/dist/ReactToastify.css'
import 'react-quill/dist/quill.snow.css' // import styles
import 'react-datepicker/dist/react-datepicker.css'
import { getAPI, getData } from '@/utils/data'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { format } from 'sql-formatter'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import { formatDistanceToNow, differenceInDays } from 'date-fns'
import { AccountContext } from '@/contexts/AccountContext'

import { TemplateData, Specs, ServiceData, TemplateFromId, ServiceFromName, TemplateGetSpecs } from '@/types/dataProvider'
import ServiceDefinitions from '../../utils/service-definitions.json'
import TemplateDefinitions from '../../utils/template-definitions.json'

const Template = (id: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setTemplateData] = useState<TemplateData>()
  const [services, setServices] = useState<ServiceData[]>()
  const [templateSpecs, setTemplateSpecs] = useState<Specs>()
  const {
    user,
    setUser,
    setIndexerDeployerStep,
    templateDataSelected,
    setTemplateDataSelected,
  } = useContext(AccountContext)

  async function getData(id: any) {
    setIsLoading(true)

    console.log('o id q vai chamar')
    console.log(id)

    // let data: TemplatesData 

    console.log("Aca viene la data!")
    let data = TemplateFromId(id.id)

    console.log(data)

    if (data) {
      let svs: ServiceData[] = []

      for (let i = 0; i < data.serviceNames.length; i++) { 
        let s = ServiceFromName(data.serviceNames[i])
        if (s) {
          svs.push(s)
        }
      }

      setTemplateData(data)
      setServices(svs)
      setTemplateSpecs(TemplateGetSpecs(data))
    }
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
        <div className="mx-auto max-w-[1380px] pl-[85px]  text-[12px] font-normal text-[#000] 2xl:text-[14px]">
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
                    placeholder=""
                    onChange={(e) => {
                      if (e.target.value.length < 1000) {
                        const newData = { ...data }
                        newData.name = e.target.value
                        setTemplateData(newData)
                      }
                    }}
                    className="w-full bg-[#fff] text-[44px] font-semibold leading-[64px] placeholder:text-[#6B7280] 2xl:text-[48px]"
                  />
                </div>
              </div>

              <div className="ml-[10px] mt-[24px]">
                <div className="flex gap-x-[4px] text-[11px] text-[#0354EC] 2xl:text-[12px]">
                  {data?.tags?.map((item, index) => (
                    <div key={index} className="underline underline-offset-2">
                      {item},
                    </div>
                  ))}
                </div>
                <textarea
                  value={data?.desc}
                  placeholder=""
                  onChange={(e) => {
                    if (e.target.value.length < 1000) {
                      const newData = { ...data }
                      newData.desc = e.target.value
                      setTemplateData(newData)
                    }
                  }}
                  className="mt-[23px] h-[100px] max-h-[100px] w-full  max-w-[735px] bg-[#fff] text-[14px] leading-[22px] placeholder:text-[#6B7280] 2xl:text-[16px]"
                />
                <div className="mt-[40px] max-w-[703px] text-[10px] md:text-[12px] lg:mt-[59px] 2xl:text-[14px]">
                  <div className="text-[16px] font-semibold 2xl:text-[18px]">
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
                      {templateSpecs?.ram}
                    </div>
                    <div>{templateSpecs?.ram}</div>
                  </div>
                  <div className="mt-[30px] border-b-[1px] border-[#DDDDDD]"></div>
                </div>
                <div className="mt-[40px] max-w-[703px] text-[10px] md:text-[12px] lg:mt-[59px] 2xl:text-[14px]">
                  <div className="text-[16px] font-semibold 2xl:text-[18px]">
                    What’s included{' '}
                  </div>
                  <div className="mt-[15px] flex border-[0.7px] border-[#CDCDCD] py-[8px] px-[5px] font-medium lg:px-[20px] ">
                    <div className="w-[15%]">Name</div>
                    <div className="w-[20%]">Description</div>
                    <div className="w-[15%]">Specs</div>
                    <div className="w-[25%]">Tags</div>
                    <div className="w-[15%]">Infra ID</div>
                  </div>
                  {data?.serviceNames && (
                    <div>
                      {services?.map((item, index) => (
                        <div key={index}>
                          <div className="mt-[8px] border-b-[1px] border-[#DDDDDD]"></div>
                          <div className="mt-[8px] flex px-[20px] font-normal">
                            <div className="w-[15%] max-w-[30%] overflow-hidden">
                              {item?.name}
                            </div>
                            <div className="w-[20%]">
                              {item.desc}
                            </div>

                            <div className="w-[15%]">
                              {'CPU, 1-Core'}
                            </div>

                            <div className="w-[25%]">{item?.tags.join(', ')}</div>
                            <div className="w-[15%]">
                              #{gerarNumeroAleatorio()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-[8px] border-b-[1px] border-[#DDDDDD]"></div>
                </div>
              </div>
            </div>
            <div className="w-full border-[0.6px] border-[#d1d5da] bg-[#fafafa] py-[5px] lg:mb-0 lg:w-[386px]">
              <div className="flex items-center gap-x-[20px] border-l-[3px] border-[#0354EC] bg-[#e5eefc] py-[10px] px-[32px]">
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }/images/template/circled-dashed.svg`}
                  alt="image"
                  className={``}
                />
                <div className="text-[14px] font-semibold leading-[36px] text-[#000] 2xl:text-[16px]">
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
                <div className="text-[14px] font-medium text-[#000] 2xl:text-[16px]">
                  Starting from{' '}
                  <span className="text-[#0354EC] line-through">
                    {/* ${data?.price} /mo */}
                    PLACEHOLDER THIS SHOULDn't be here
                  </span>
                </div>
                <div className="text-[14px] font-bold text-[#0354EC] 2xl:text-[16px]">
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
                }  rounded-[12px] bg-[#0354EC] px-[133px] py-[15px] text-[14px] font-bold text-[#fff] hover:bg-[#014cd7] 2xl:text-[16px]`}
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
                <div className="text-[14px] font-semibold leading-[36px] text-[#959595] 2xl:text-[16px]">
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
                <div className="text-[14px] font-semibold leading-[36px] text-[#959595] 2xl:text-[16px]">
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
                <div className="text-[14px] font-semibold leading-[36px] text-[#959595] 2xl:text-[16px]">
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
                <div className="text-[14px] font-semibold leading-[36px] text-[#959595] 2xl:text-[16px]">
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

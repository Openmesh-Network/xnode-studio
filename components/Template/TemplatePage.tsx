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

import { TemplateData, Specs, ServiceData, TemplateFromId, ServiceFromName, TemplateGetSpecs, DeploymentConfiguration } from '@/types/dataProvider'
import ServiceDefinitions from '../../utils/service-definitions.json'
import TemplateDefinitions from '../../utils/template-definitions.json'

const Template = (id: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // const [data, setTemplateData] = useState<TemplateData>()
  const [data, setDeployConfig] = useState<DeploymentConfiguration>()
  const [templateSpecs, setTemplateSpecs] = useState<Specs>()
  const {
    user,
    setUser,
    setIndexerDeployerStep,
    draft,
    setDraft
  } = useContext(AccountContext)

  async function getData(id: any) {
    setIsLoading(true)

    // XXX: Not sure if this is the best place to put this but whatever.
    if (id.id == 'edit') {
      // Problem with this is the draft contains extra info like the location or whatever.
      if (draft) {
        setDeployConfig(draft)
      } else {
        setDeployConfig(JSON.parse(localStorage.getItem('draft')) as DeploymentConfiguration)
      }
    } else {
      // Generate the config from the template id.
      console.log('o id q vai chamar')
      console.log(id)

      console.log("Aca viene la data!")
      let template = TemplateFromId(id.id)

      console.log(template)

      if (template) {
        let svs: ServiceData[] = []

        for (let i = 0; i < template.serviceNames.length; i++) { 
          let s = ServiceFromName(template.serviceNames[i])
          if (s) {
            svs.push(s)
          }
        }

        const d: DeploymentConfiguration = {
          name: template.name,
          desc: template.desc,
          location: "",
          services: svs,
          // XXX: Actually check from AccountContext.
          isUnit: false,
          provider: ""
        }

        setDeployConfig(d)
        setTemplateSpecs(TemplateGetSpecs(template))
      } else {
        // XXX:
        // NUCLEAR APOCALIPSE TIER!
        // Should just redirect probably.
      }
    }

    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    // When anything is clicked?
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
                        setDeployConfig(newData)
                      }
                    }}
                    className="w-full bg-[#fff] text-[44px] font-semibold leading-[64px] placeholder:text-[#6B7280] 2xl:text-[48px]"
                  />
                </div>
              </div>

              <div className="ml-[10px] mt-[24px]">
                <div className="flex gap-x-[4px] text-[11px] text-[#0354EC] 2xl:text-[12px]">
                  {TemplateFromId(id)?.tags?.map((item, index) => (
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
                      setDeployConfig(newData)
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
                  </div>
                  {data?.services && (
                    <div>
                      {data.services?.map((item, index) => (
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

                            <button data-modal-target="idname" type="button" data-modal-toggle="idname">
                              Edit
                            </button>

                            {
                              // TODO: Save a record of the state here? Since it's where the services' configuration will be changed.
                              // Could maybe have each service find inself on the list of modified services and modify that?
                              // Might need a way to tell the user what's up with their config?
                            }

                            <div id="idname" aria-hidden={true} tabIndex={-1} className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-1000 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                              <div className="relative p-4 w-full max-w-2xl max-h-full">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                  <div className="flex items-center justify-between p-3 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                      Terms of Service
                                    </h3>
                                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                      </svg>
                                      <span className="sr-only">Close modal</span>
                                    </button>
                                  </div>
                                  <div className="p-4 md:p-5 space-y-4">
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                      With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                                    </p>
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                      The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                                    </p>
                                  </div>
                                  <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                    <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                                    <button data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button>
                                  </div>
                                </div>
                              </div>
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

            {/* <button data-modal-target="popup-modal" data-modal-toggle="popup-modal" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button"> */}
            {/*   Toggle modal */}
            {/* </button> */}

            {/* <div id="popup-modal" tabIndex={-1} className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"> */}
            {/*   <div className="relative p-4 w-full max-w-md max-h-full"> */}
            {/*     <div className="relative bg-white rounded-lg shadow dark:bg-gray-700"> */}
            {/*       <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal"> */}
            {/*         <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"> */}
            {/*           <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/> */}
            {/*         </svg> */}
            {/*         <span className="sr-only">Close modal</span> */}
            {/*       </button> */}
            {/*       <div className="p-4 md:p-5 text-center"> */}
            {/*         <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"> */}
            {/*           <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/> */}
            {/*         </svg> */}
            {/*         <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3> */}
            {/*         <button data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"> */}
            {/*           Yes, I'm sure */}
            {/*         </button> */}
            {/*         <button data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button> */}
            {/*       </div> */}
            {/*     </div> */}
            {/*   </div> */}
            {/* </div> */}

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
                  { /* XXX: UMM LIE??? */ } 
                  $1,475.43 Monthly savings{' '}
                </div>
              </div>
              <div
                onClick={() => {
                  if (data?.name?.length > 0) {
                    setIndexerDeployerStep(0)
                  }

                  setDeployConfig(data)
                  setDraft(data)
                  localStorage.setItem('draft', JSON.stringify(data))
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

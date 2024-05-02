/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'
/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from 'react'
import { getAPI, getDatasets } from '@/utils/data'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { TemplatesProducts } from '@/types/dataProvider'
import { SmileySad } from 'phosphor-react'
import Filter from '@/components/Filter'
import { TextField, Autocomplete } from '@mui/material'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import ProductsList from '../ProductsList'
import Dropdown, { ValueObject } from './Dropdown'
import { AccountContext } from '@/contexts/AccountContext'

export const optionsNetwork = [
  {
    name: 'testing',
    value: 'testing',
  },
]

type dataAPI = {
  products: TemplatesProducts[]
  hasMorePages: boolean
  totalProducts: number
}

export const providerNameToLogo = {
  Equinix: {
    src: 'new-equinix.png',
    width: 'w-[50px]',
  },
}

const TemplateStep = () => {
  const [templates, setTemplates] = useState<TemplatesProducts[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [displayToggle, setDisplayToggle] = useState<string>('list')
  const [categoryOpen, setCategoryOpen] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [searchInput, setSearchInput] = useState<string>()
  const [filterSelection, setFilterSelection] =
    useState<string>('All Templates')
  const [hasMorePages, setHasMorePages] = useState<boolean>(false)
  const [totalResults, setTotalResults] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMoreTemplates, setIsLoadingMoreTemplates] = useState(false)
  const [progressLoadingBar, setProgressLoadingBar] = useState(0)
  const [progressLoadingText, setProgressLoadingText] = useState(
    'Checking 19 providers',
  )
  const [selected, setSelected] = useState<ValueObject | null>(null)

  const { setIndexerDeployerStep, templateSelected, setTemplateSelected } =
    useContext(AccountContext)

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  async function getData(withoutFilter?: boolean) {
    setIsLoading(true)

    let url = `/openmesh-data/functions/templateProducts?page=${page}`
    if (searchInput?.length > 0 && !withoutFilter) {
      url = `${url}&searchBarFilter=${searchInput}`
    }

    let data: dataAPI
    try {
      data = await getAPI(url)
    } catch (err) {
      toast.error('Something occured')
    }

    // doing it gradually as requested by Ashton
    const firstStep = data.products.slice(0, 1)
    setTemplates(firstStep)
    setProgressLoadingBar(20)
    setProgressLoadingText('Searching Equinix')
    await delay(2000)

    const secondStep = data.products.slice(0, 3)
    setTemplates(secondStep)
    setProgressLoadingBar(33)
    await delay(2000)

    const thirdStep = data.products.slice(0, 3)
    setTemplates(thirdStep)
    setProgressLoadingBar(53)
    setProgressLoadingText('Checking CPUs')
    await delay(2000)

    const fourStep = data.products.slice(0, 10)
    setTemplates(fourStep)
    setProgressLoadingBar(65)
    setProgressLoadingText('Searching Vultr')
    await delay(2000)

    const fiveStep = data.products.slice(0, 25)
    setTemplates(fiveStep)
    setProgressLoadingBar(100)
    await delay(2000)

    setIsLoading(false)
    setTemplates(data.products)
    setHasMorePages(data.hasMorePages)
    setTotalResults(String(data.totalProducts))
  }

  async function loadMoreTemplates() {
    setIsLoadingMoreTemplates(true)

    let data: dataAPI
    let url = `/openmesh-data/functions/templateProducts?page=${page + 1}`
    if (searchInput?.length > 0) {
      url = `${url}&searchBarFilter=${searchInput}`
    }
    try {
      data = await getAPI(url)
    } catch (err) {
      toast.error('Something occured')
    }
    setPage(page + 1)
    setIsLoadingMoreTemplates(false)
    setTemplates([...templates, ...data.products])
    setHasMorePages(data.hasMorePages)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <section className="relative z-10 pt-[30px] pb-[200px] lg:pt-0">
      <div className="mx-auto max-w-[1380px] px-[20px]  text-[14px] font-normal text-[#000]">
        <div className="flex justify-between gap-x-[95px]">
          <div className="w-full text-center ">
            <div className="mx-auto mb-[12.5px] text-[48px] font-semibold leading-[64px]">
              Find your <span className="text-[#0059ff]">Template</span>
            </div>
            <div className="mt-[7px] text-[16px] font-normal leading-[32px] text-[#4d4d4d]">
              Jumpstart your development process with our pre-built templates
            </div>
            <div className="relative mt-[48px]">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/template/small.svg`}
                alt="image"
                className="absolute -top-[10px] left-0"
              />
              <div className="mx-auto flex w-fit gap-x-[12px] text-[16px] font-normal leading-[16px] text-[#4d4d4d]">
                <div
                  onClick={() => {
                    setFilterSelection('All Templates')
                  }}
                  className={`cursor-pointer rounded-[100px] px-[12px] py-[6px] ${
                    filterSelection === 'All Templates'
                      ? 'bg-[#4d4d4d] font-bold text-[#fff]'
                      : 'hover:text-[#252525]'
                  }`}
                >
                  All Templates
                </div>
                <div
                  onClick={() => {
                    setFilterSelection('Openmesh')
                  }}
                  className={`cursor-pointer rounded-[100px] px-[12px] py-[6px] ${
                    filterSelection === 'Openmesh'
                      ? 'bg-[#4d4d4d] font-bold text-[#fff]'
                      : 'hover:text-[#252525]'
                  }`}
                >
                  Openmesh
                </div>
                <div
                  onClick={() => {
                    setFilterSelection('Community')
                  }}
                  className={`cursor-pointer rounded-[100px] px-[12px] py-[6px] ${
                    filterSelection === 'Community'
                      ? 'bg-[#4d4d4d] font-bold text-[#fff]'
                      : 'hover:text-[#252525]'
                  }`}
                >
                  Community
                </div>
              </div>
            </div>
            <div className="mt-[34px] h-[1px] w-full bg-[#E6E8EC]"></div>
            <div className="mt-[30px] flex gap-x-[70px]">
              <div>
                <div className="w-[256px] rounded-[5px] border-[1px] border-[#d1d5da] px-[16px] pt-[15px] pb-[25px]">
                  <div className="flex items-center justify-between gap-x-[4px]">
                    <div className="text-[16px] font-medium leading-[24px] text-[#000]">
                      Category
                    </div>
                    <img
                      onClick={() => {
                        setCategoryOpen(!categoryOpen)
                      }}
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/arrow-top.svg`}
                      alt="image"
                      className={`${
                        !categoryOpen && 'rotate-180'
                      } cursor-pointer transition-all duration-300`}
                    />
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[30px] flex gap-x-[6px]`}
                  >
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/xnode-circle.svg`}
                      alt="image"
                      className=""
                    />
                    <div className="cursor-pointer text-[16px] font-normal leading-[20px] text-[#959595]">
                      Validator Node (1)
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-end gap-x-[20px]">
                  <Dropdown
                    optionSelected={selected}
                    options={optionsNetwork}
                    placeholder="Sort By"
                    onValueChange={(value) => {
                      setSelected(value)
                    }}
                  />
                  <div className="flex">
                    <div
                      onClick={() => {
                        setDisplayToggle('list')
                      }}
                      className={`${
                        displayToggle === 'list' ? 'bg-[#0059ff]' : 'bg-[#fff]'
                      } cursor-pointer rounded-l-[5px] border-[1px] border-r-0 border-[#d1d5da] p-[16px]`}
                    >
                      {displayToggle === 'list' ? (
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }/images/template/list.svg`}
                          alt="image"
                          className=""
                        />
                      ) : (
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }/images/template/list-cinza.svg`}
                          alt="image"
                          className=""
                        />
                      )}
                    </div>
                    <div
                      onClick={() => {
                        setDisplayToggle('quadrados')
                      }}
                      className={`${
                        displayToggle === 'quadrados'
                          ? 'bg-[#0059ff]'
                          : 'bg-[#fff]'
                      } cursor-pointer rounded-r-[5px] border-[1px] border-l-0 border-[#d1d5da] p-[16px]`}
                    >
                      {displayToggle === 'quadrados' ? (
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }/images/template/quadrados.svg`}
                          alt="image"
                          className=""
                        />
                      ) : (
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }/images/template/quadrados-cinza.svg`}
                          alt="image"
                          className=""
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-[42px] text-start">
                  <div className="text-[18px] font-medium leading-[28px] text-[#000]">
                    Featured
                  </div>
                  <div
                    onClick={() => {
                      setSelectedTemplate('first')
                    }}
                    className={`${
                      selectedTemplate === 'first'
                        ? 'border-[2px] border-[#0059ff] bg-[#e5eefc]'
                        : 'hover:bg-[#fafafa6b]'
                    } mt-[17px] w-fit cursor-pointer rounded-[8px] border-[1px] border-[#fafafa]  py-[27px] px-[22px] shadow-md`}
                  >
                    <div className="flex gap-x-[75px]">
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                            ? process.env.NEXT_PUBLIC_BASE_PATH
                            : ''
                        }/images/template/xnode-circle.svg`}
                        alt="image"
                        className="h-[33px] w-[33px]"
                      />
                      <div className="flex w-full items-center gap-x-[9px] rounded-[16px] bg-[#fff] px-[12px] py-[4px]">
                        <div className="h-[10px] w-[10px] rounded-full bg-[#0059ff]"></div>
                        <div className="text-[14px] font-bold leading-[24px] text-[#0059ff]">
                          Category
                        </div>
                      </div>
                    </div>
                    <div className="mt-[20px]">
                      <div className="text-[18px] font-medium text-[#000]">
                        Validator Node
                      </div>
                      <div className="mt-[6px] text-[16px] font-normal leading-[20px] text-[#959595]">
                        A bit of context on what <br /> this template helps with
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-fit w-[533px] rounded-[8px] border-[1px] border-[#cfd3d8] p-[32px] shadow-[0_5px_12px_0px_rgba(0,0,0,0.10)]">
            <div className="flex items-center justify-between">
              <div className=" text-[24px] font-bold !leading-[40px]">
                Your progress
              </div>
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/template/close-gray.svg`}
                alt="image"
                className="my-auto w-[24px] cursor-pointer pt-[2px]"
              />
            </div>
            <div className="mt-[32px] grid gap-y-[32px]">
              <div className="flex items-center gap-x-[20px]">
                <div
                  className={`flex h-[48px] w-[48px] rounded-full  ${
                    selectedTemplate ? 'bg-[#0059ff]' : 'bg-[#e5eefc]'
                  }`}
                >
                  {selectedTemplate && (
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/check.svg`}
                      alt="image"
                      className="mx-auto my-auto"
                    />
                  )}
                </div>
                <div className="text-[18px] font-semibold">
                  Select a template
                </div>
              </div>
              {selectedTemplate && (
                <div
                  onClick={() => {
                    setIndexerDeployerStep(0)
                  }}
                  className="mt-[10px] cursor-pointer whitespace-nowrap rounded-[12px] bg-[#0059ff] px-[125px] py-[13px] text-[16px] font-bold  text-[#fff] hover:bg-[#014cd7]"
                >
                  Next step
                </div>
              )}
              <div className="flex items-center gap-x-[20px]">
                <div className="h-[48px] w-[48px] rounded-full bg-[#E6E8EC]"></div>
                <div className="text-[18px] font-semibold text-[#959595]">
                  Select a provider{' '}
                </div>
              </div>
            </div>
            <div className="mt-[25px]">
              <div className="mt-[30px] flex items-center gap-x-[20px]">
                <div className="h-[48px] w-[48px] rounded-full bg-[#E6E8EC]"></div>
                <div className="text-[18px] font-semibold text-[#959595]">
                  Choose your configuration{' '}
                </div>
              </div>
              <div className="mt-[34px] flex items-center gap-x-[20px]">
                <div className="h-[48px] w-[48px] rounded-full bg-[#E6E8EC]"></div>
                <div className="text-[18px] font-semibold text-[#959595]">
                  Performing connection{' '}
                </div>
              </div>
              <div className="mt-[34px] flex items-center gap-x-[20px]">
                <div className="h-[48px] w-[48px] rounded-full bg-[#E6E8EC]"></div>
                <div className="text-[18px] font-semibold text-[#959595]">
                  Service deployed{' '}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TemplateStep

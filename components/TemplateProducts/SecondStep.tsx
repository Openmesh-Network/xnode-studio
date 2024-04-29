/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
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

const Configuration = () => {
  const [templates, setTemplates] = useState<TemplatesProducts[]>([])
  const [templateSelected, setTemplateSelected] =
    useState<TemplatesProducts | null>()
  const [page, setPage] = useState<number>(1)
  const [searchInput, setSearchInput] = useState<string>()
  const [hasMorePages, setHasMorePages] = useState<boolean>(false)
  const [totalResults, setTotalResults] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMoreTemplates, setIsLoadingMoreTemplates] = useState(false)
  const [progressLoadingBar, setProgressLoadingBar] = useState(0)
  const [progressLoadingText, setProgressLoadingText] = useState(
    'Checking 19 providers',
  )
  const [selected, setSelected] = useState<ValueObject | null>(null)

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
          <div className="">
            <div className="mb-[12.5px] text-[48px] font-semibold -tracking-[1.9px]">
              Choose your configuration
            </div>
            <div className="pt-[40.5px]">
              <div className="">
                <div className="flex h-[40px]">
                  <div className="mr-[2px] w-[61px] rounded-l-[8px] bg-[#000]"></div>
                  <div className="w-[250px] bg-[#0059ff]"></div>
                  <div className="flex w-[259px] items-center justify-center rounded-r-[8px] bg-[#e5eefc] text-[16px] font-medium">
                    available to rent and get paid
                  </div>
                </div>
                <div className="mt-[13.63px] flex justify-between gap-x-[1px]">
                  <div className="flex items-center gap-x-[8px]">
                    <div className="h-[13px] w-[13px] rounded-full bg-[#000]"></div>
                    <div className="text-[16px] font-normal">
                      Openmesh core (1.96 TB)
                    </div>
                  </div>
                  <div className="flex items-center gap-x-[8px]">
                    <div className="h-[13px] w-[13px] rounded-full bg-[#0059ff]"></div>
                    <div className="text-[16px] font-normal">
                      Your services (33 GB){' '}
                    </div>
                  </div>
                  <div className="flex items-center gap-x-[8px]">
                    <div className="h-[13px] w-[13px] rounded-full bg-[#e5eefc]"></div>
                    <div className="text-[16px] font-normal">
                      Free (220.9 MB){' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-fit rounded-[8px] border-[1px] border-[#cfd3d8] p-[32px] shadow-[0_5px_12px_0px_rgba(0,0,0,0.10)]">
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
                    templateSelected ? 'bg-[#0059ff]' : 'bg-[#e5eefc]'
                  }`}
                >
                  {templateSelected && (
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
              <div className="flex items-center gap-x-[20px]">
                <div className="h-[48px] w-[48px] rounded-full bg-[#e5eefc]"></div>
                <div className="text-[18px] font-semibold">
                  Select a provider{' '}
                </div>
              </div>
            </div>
            <div className="mt-[25px] px-[8px]">
              <div className="grid gap-y-[10px]">
                <div className="flex items-center gap-x-[7px]">
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/mini-equinix.svg`}
                    alt="image"
                    className=""
                  />
                  <div className="text-[14px] font-extralight">
                    Bare metal Provider
                  </div>
                </div>
                <div className="flex items-center gap-x-[5px]">
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/australia.svg`}
                    alt="image"
                    className=""
                  />
                  <div className="text-[14px] font-extralight">
                    Country & Region{' '}
                  </div>
                </div>
              </div>
              <div className="mt-[26px] text-[12px] font-bold">
                {templateSelected?.cpuCores} vCPU + {templateSelected?.ram} GB
                memory
              </div>
              <div className="mt-[19px] flex justify-between bg-[#e5eefc] py-[13px] px-[18px] text-[14px] font-normal">
                <div>Item</div>
                <div>Price</div>
              </div>
              <div className="mt-[30px] flex justify-between border-b-[1px] border-[#D4D4D4] px-[18px] pb-[5px] text-[14px]">
                <div className="font-medium text-[#959595]">
                  {templateSelected?.productName}
                </div>
                <div className="font-bold">{templateSelected?.priceMonth}</div>
              </div>
              <div className="mt-[26px] flex justify-between">
                <div className="text-[16px] font-medium">Total</div>
                <div className="text-end">
                  <div className="text-[28px] font-bold text-[#0059ff]">
                    {templateSelected?.priceMonth}
                  </div>
                  {templateSelected?.priceHour && (
                    <div className="text-[12px] font-normal">
                      That's about {templateSelected?.priceHour} hourly
                    </div>
                  )}
                </div>
              </div>
              <div
                onClick={() => {}}
                className="mt-[30px] cursor-pointer rounded-[12px] bg-[#0059ff] px-[125px] py-[13px] text-[16px] font-bold !leading-[150%] text-[#fff] hover:bg-[#014cd7]"
              >
                Deploy
              </div>
              <div className="mt-[30px] flex items-center gap-x-[20px]">
                <div className="h-[48px] w-[48px] rounded-full bg-[#e5eefc]"></div>
                <div className="text-[18px] font-semibold text-[#959595]">
                  Choose your configuration{' '}
                </div>
              </div>
              <div className="mt-[34px] flex items-center gap-x-[20px]">
                <div className="h-[48px] w-[48px] rounded-full bg-[#e5eefc]"></div>
                <div className="text-[18px] font-semibold text-[#959595]">
                  Performing connection{' '}
                </div>
              </div>
              <div className="mt-[34px] flex items-center gap-x-[20px]">
                <div className="h-[48px] w-[48px] rounded-full bg-[#e5eefc]"></div>
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

export default Configuration

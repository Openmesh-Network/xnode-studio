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
    name: 'Equinix',
    value: 'Equinix',
  },
  {
    name: 'Vultr',
    value: 'Vultr',
  },
  {
    name: 'OneProvider',
    value: 'OneProvider',
  },
  {
    name: 'Heficed',
    value: 'Heficed',
  },
  {
    name: 'Latitude.sh',
    value: 'Latitude.sh',
  },
  {
    name: 'PhoenixNap',
    value: 'PhoenixNap',
  },
  {
    name: 'Fasthosts',
    value: 'Fasthosts',
  },
  {
    name: 'Colohouse',
    value: 'Colohouse',
  },
  {
    name: 'AMD House',
    value: 'AMD House',
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

const TemplateProducts = () => {
  const [templates, setTemplates] = useState<TemplatesProducts[]>([])
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

  const { setIndexerDeployerStep, templateSelected, setTemplateSelected } =
    useContext(AccountContext)

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  async function getData(withoutFilter?: boolean, category?: string) {
    setIsLoading(true)

    let url = `/openmesh-data/functions/templateProducts?page=${page}`
    if (searchInput?.length > 0 && !withoutFilter) {
      url = `${url}&searchBarFilter=${searchInput}`
    }
    if (category && !withoutFilter) {
      url = `${url}&categoryFilter=${category}`
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
    <section className="relative z-10 pt-[30px] lg:pt-0">
      <div className="mx-auto max-w-[1380px] pl-[85px]  text-[14px] font-normal text-[#000]">
        <div className="flex justify-between gap-x-[50px]">
          <div className="pt-[44px]">
            <div className="mb-[12.5px] text-[48px] font-semibold leading-[64px]">
              Select a provider
            </div>
            <div className="border-t-[1px] border-t-[#cfd3d8] pt-[32px]">
              <div className="flex">
                <div className="mr-[49px] rounded-[8px] border-[1px]  border-[#cfd3d8] px-[12px] py-[15px]">
                  <div className="flex items-center gap-x-[8px]">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/search-2.svg`}
                      alt="image"
                      className="h-[13.5px] w-[13.5px]"
                    />
                    <input
                      value={searchInput}
                      placeholder="Search"
                      onChange={(e) => {
                        if (e.target.value.length < 10000) {
                          setSearchInput(e.target.value)
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && searchInput?.length > 0) {
                          getData()
                        }
                      }}
                      className="w-[364px] bg-[#fff] text-[16px] placeholder:text-[#6B7280]"
                    />
                    <img
                      onClick={() => {
                        setSearchInput('')
                      }}
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/x.svg`}
                      alt="image"
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <div className="mr-[17px]">
                  <Dropdown
                    optionSelected={selected}
                    options={optionsNetwork}
                    placeholder="Category"
                    onValueChange={(value) => {
                      setSelected(value)
                      getData(false, value.value)
                    }}
                  />
                </div>
                <div
                  onClick={() => {
                    setSearchInput('')
                    setSelected(null)
                    getData(true)
                  }}
                  className="my-auto flex w-full cursor-pointer items-center gap-x-[10px]"
                >
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/remove.svg`}
                    alt="image"
                    className="w-[24px]"
                  />
                  <div className="text-[16px] font-normal text-[#4d4d4d] hover:text-[#3b3b3b]">
                    Reset filter
                  </div>
                </div>
              </div>
              {isLoading ? (
                <div className="mt-[20px]">
                  <div className="flex gap-x-[10px]">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/loading.svg`}
                      alt="image"
                      className="w-[20px] animate-spin"
                    />
                    <div>{progressLoadingText}</div>
                  </div>

                  <div className="mt-[10px] h-[10px] w-full rounded-[50px] border-[1px] border-[#E4E5E8] bg-[#fff]">
                    <div
                      style={{ width: `${progressLoadingBar}%` }}
                      className="h-full rounded-full bg-[#0059ff] transition-all duration-300"
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="mt-[25px]">{totalResults} results</div>
              )}
            </div>
            <div className="mt-[25px] grid max-h-[700px] w-full gap-y-[38px] overflow-y-auto pr-[10px] scrollbar-thin scrollbar-track-[#F9F9F9] scrollbar-thumb-[#c5c4c4]">
              {templates.map((tmp, index) => (
                <div
                  key={index}
                  className="flex items-center rounded-[8px] border-[1px] border-[#E4E5E8] py-[30px] pl-[24px] pr-[62px] shadow-[0_5px_12px_0px_rgba(0,0,0,0.10)]"
                >
                  <div className="mr-[40px]">
                    {providerNameToLogo[tmp.providerName] ? (
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                            ? process.env.NEXT_PUBLIC_BASE_PATH
                            : ''
                        }/images/template/${
                          providerNameToLogo[tmp.providerName].src
                        }`}
                        alt="image"
                        className={`${
                          providerNameToLogo[tmp.providerName].width
                        } mx-auto mb-[15px]`}
                      />
                    ) : (
                      <div>{tmp.providerName}</div>
                    )}
                    <div>Public Cloud</div>
                  </div>
                  <div className="max-w-[309px]">
                    <div className="text-[18px] font-bold">
                      {tmp.productName}
                    </div>
                    <div className="mt-[6px] text-[16px] font-normal text-[#737373]">
                      <div className="">{tmp.location}</div>
                      <div className="mt-[25px] text-[12px] font-normal text-[#0059ff]">
                        <span className="underline">RPC Nodes</span>,{' '}
                        <span className="underline">Web3 Infrastructure</span>,{' '}
                        <span className="underline">Blockchain Apps</span>
                      </div>
                      <div className="mt-[15px]">
                        {tmp.cpuGHZ} GHZ, {tmp.cpuCores} CPU cores,{' '}
                        {tmp.cpuThreads} Threads, {tmp.ram} RAM,{' '}
                        {tmp.storageTotal} GB, {tmp.network} Gbps
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto grid text-center">
                    <div className="mx-auto w-fit text-[16px] font-medium leading-[20px] line-through">
                      Est {tmp.priceMonth} /mo
                    </div>
                    <div
                      onClick={() => {
                        setTemplateSelected(tmp)
                      }}
                      className={`mt-[15px] cursor-pointer border-[1px] border-[#0059ff] ${
                        tmp?.id === templateSelected?.id
                          ? 'bg-[#0059ff]  text-[#fff]'
                          : 'bg-[#fff] text-[#0059ff] hover:bg-[#f1f1f15e]'
                      } w-[174px] rounded-[12px]  py-[13px] text-[16px] font-bold !leading-[150%]  `}
                    >
                      {tmp?.id === templateSelected?.id ? 'Selected' : 'Select'}
                    </div>
                    <div className="mt-[11px] text-[16px] font-bold text-[#0059ff]">
                      Cashback $200
                    </div>
                  </div>
                </div>
              ))}
              {hasMorePages && !isLoadingMoreTemplates && (
                <div
                  onClick={() => {
                    loadMoreTemplates()
                  }}
                  className="mx-auto cursor-pointer rounded-[5px] border-[1px] border-[#cfd3d8] py-[5px] px-[15px]"
                >
                  Show more
                </div>
              )}
              {isLoadingMoreTemplates && (
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }/images/template/loading.svg`}
                  alt="image"
                  className="mx-auto w-[20px] animate-spin"
                />
              )}
            </div>
          </div>
          <div className="mt-[10px] w-full border-[0.6px] border-[#d1d5da] bg-[#fafafa] py-[10px] lg:mb-0 lg:w-[386px] lg:py-[32px]">
            <div className="flex justify-between px-[32px]">
              <div className="text-[18px] font-bold leading-[40px]">
                Your progress
              </div>
            </div>
            <div className="mt-[22px] flex items-center gap-x-[20px] py-[10px] px-[32px]">
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
            <div className="mt-[31px] flex items-center gap-x-[20px] border-l-[3px] border-[#0354EC] bg-[#e5eefc] py-[10px] px-[32px]">
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
                Select a provider
              </div>
            </div>
            {templateSelected && (
              <>
                <div className="ml-[92px] mt-[21px] grid gap-y-[10px]">
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
                <div className="mt-[18px] ml-[92px] text-[16px] font-bold">
                  {templateSelected?.cpuCores} vCPU + {templateSelected?.ram} GB
                  memory
                </div>
                <div className="mx-[36px] mt-[26px] flex justify-between bg-[#e5eefc] py-[13px] px-[18px] text-[14px] font-normal">
                  <div>Item</div>
                  <div>Price</div>
                </div>
                <div className="mx-[36px] mt-[30px] flex justify-between border-b-[1px] border-[#D4D4D4] px-[18px] pb-[5px] text-[14px]">
                  <div className="font-medium text-[#959595]">
                    {templateSelected?.productName}
                  </div>
                  <div className="font-bold">
                    {templateSelected?.priceMonth}
                  </div>
                </div>
                <div className="mx-[36px] mt-[26px] flex justify-between">
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
                  onClick={() => {
                    setIndexerDeployerStep(1)
                  }}
                  className="mx-auto mt-[30px] w-fit cursor-pointer rounded-[12px] bg-[#0059ff] px-[133px] py-[15px] text-center text-[16px] font-bold leading-[22px] text-[#fff] hover:bg-[#014cd7]"
                >
                  Deploy
                </div>
              </>
            )}
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
  )
}

export default TemplateProducts

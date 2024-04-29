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
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMoreTemplates, setIsLoadingMoreTemplates] = useState(false)
  const [progressLoadingBar, setProgressLoadingBar] = useState(0)
  const [selected, setSelected] = useState<ValueObject>()

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  async function getData() {
    setIsLoading(true)

    let data: { products: TemplatesProducts[]; hasMorePages: boolean }
    try {
      data = await getAPI(
        `/openmesh-data/functions/templateProducts?page=${page}`,
      )
    } catch (err) {
      toast.error('Something occured')
    }

    // doing it gradually as requested by Ashton
    const firstStep = data.products.slice(0, 1)
    setTemplates(firstStep)
    setProgressLoadingBar(20)
    await delay(2000)

    const secondStep = data.products.slice(0, 3)
    setTemplates(secondStep)
    setProgressLoadingBar(33)
    await delay(2000)

    const thirdStep = data.products.slice(0, 3)
    setTemplates(thirdStep)
    setProgressLoadingBar(53)
    await delay(2000)

    const fourStep = data.products.slice(0, 10)
    setTemplates(fourStep)
    setProgressLoadingBar(65)
    await delay(2000)

    const fiveStep = data.products.slice(0, 25)
    setTemplates(fiveStep)
    setProgressLoadingBar(100)
    await delay(2000)

    setIsLoading(false)
    setTemplates(data.products)
    setHasMorePages(data.hasMorePages)
  }

  async function loadMoreTemplates() {
    setIsLoadingMoreTemplates(true)

    let data: { products: TemplatesProducts[]; hasMorePages: boolean }
    try {
      data = await getAPI(
        `/openmesh-data/functions/templateProducts?page=${page + 1}`,
      )
    } catch (err) {
      toast.error('Something occured')
    }
    setPage(page + 1)
    setIsLoadingMoreTemplates(false)
    setTemplates([...templates, ...data.products])
    setHasMorePages(data.hasMorePages)
  }

  const options = ['test', 'test2']

  useEffect(() => {
    getData()
  }, [])

  return (
    <section className="relative z-10 pt-[30px] pb-[200px] lg:pt-0">
      <div className="mx-auto max-w-[1380px] px-[20px]  text-[14px] font-normal text-[#000]">
        <div className="flex">
          <div className="">
            <div className="mb-[12.5px] text-[64px] font-semibold">Title</div>
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
                      onChange={(e) => setSearchInput(e.target.value)}
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
                    }}
                  />
                </div>
                <div className="my-auto flex h-fit cursor-pointer items-center justify-center gap-x-[12px] rounded-[90px] bg-[#0059ff] py-[16px] px-[24px] hover:bg-[#014cd7]">
                  <div className="text-[16px] font-bold text-[#fff]">
                    Filter
                  </div>
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/close.svg`}
                    alt="image"
                    className=""
                  />
                </div>
              </div>
              <div className="mt-[20px]">
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }/images/template/loading.svg`}
                  alt="image"
                  className="w-[20px] animate-spin"
                />
                <div className="mt-[10px] h-[10px] w-full rounded-[50px] border-[1px] border-[#E4E5E8] bg-[#fff]">
                  <div
                    style={{ width: `${progressLoadingBar}%` }}
                    className="h-full rounded-full bg-[#0059ff] transition-all duration-300"
                  ></div>
                </div>
              </div>
            </div>
            <div className="mt-[25px] grid w-full gap-y-[38px]">
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
                  <div className="ml-auto grid gap-y-[9px] text-center">
                    <div className="mx-auto w-fit text-[18px] font-medium line-through">
                      Est {tmp.priceMonth} p/m
                    </div>
                    <div className="cursor-pointer rounded-[12px] bg-[#0059ff] px-[58.5px] py-[13px] text-[16px] font-bold !leading-[150%] text-[#fff] hover:bg-[#014cd7]">
                      Deploy
                    </div>
                    <div className="text-[16px] font-bold text-[#0059ff]">
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
              {isLoadingMoreTemplates && <div> loading </div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TemplateProducts

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

const TemplateProducts = () => {
  const [templates, setTemplates] = useState<TemplatesProducts[]>([])
  const [page, setPage] = useState<number>(1)
  const [searchInput, setSearchInput] = useState<string>()
  const [hasMorePages, setHasMorePages] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMoreTemplates, setIsLoadingMoreTemplates] = useState(false)
  const [selected, setSelected] = useState<ValueObject>()

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

  if (isLoading) {
    return (
      <section className="bg-white pl-[30px] pr-[30px] pt-[46px] pb-[50px] text-[#000] md:pl-[90px] md:pr-[130px]">
        <div className="container hidden h-60 animate-pulse px-0 pb-12 md:flex">
          <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
          <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
        </div>
        <div className="container h-60 animate-pulse px-0 pb-12 md:hidden">
          <div className="mt-[10px] h-10 w-full animate-pulse bg-[#dfdfdf]"></div>
          <div className="mt-[10px] h-10 w-full animate-pulse bg-[#dfdfdf]"></div>
          <div className="mt-[20px] h-32 w-full animate-pulse bg-[#dfdfdf]"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative z-10 pt-[30px] lg:pt-0">
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
            </div>
            <div className="mt-[25px] grid w-full gap-y-[38px]">
              {templates.map((tmp, index) => (
                <div
                  key={index}
                  className="flex items-center rounded-[8px] border-[1px] border-[#E4E5E8] py-[30px] pl-[24px] pr-[62px] shadow-[0_5px_12px_0px_rgba(0,0,0,0.10)]"
                >
                  <div className="mr-[40px]">
                    <div>{tmp.providerName}</div>
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
                        CPU, 8-Core (16-Thread), RAM, 12GB DDR4 ; Storage, 500GB
                        SSD
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto grid gap-y-[9px] text-center">
                    <div className="mx-auto w-fit text-[18px] font-medium line-through">
                      Est $260 p/m
                    </div>
                    <div className="cursor-pointer rounded-[12px] bg-[#0059ff] px-[58.5px] py-[13px] text-[16px] font-bold !leading-[150%] text-[#fff]">
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

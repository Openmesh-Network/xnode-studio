/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'

/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react'
import { getAPI, getDatasets } from '@/utils/data'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AccountContext } from '@/contexts/AccountContext'
import { Autocomplete, TextField } from '@mui/material'
import { SmileySad } from 'phosphor-react'

import { TemplatesProducts } from '@/types/dataProvider'
import Filter from '@/components/Filter'

import ProductsList from '../ProductsList'
import Dropdown, { ValueObject } from '../TemplateProducts/Dropdown'
import DropdownWithLabel from './DropdownWithLabel'

export const optionsNetwork = [
  {
    name: 'Australia',
    value: 'Australia',
  },
]

export const optionsRegion = [
  {
    name: 'Sydney',
    value: 'Sydney',
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

const FromScratch = () => {
  const [templates, setTemplates] = useState<TemplatesProducts[]>([])
  const [page, setPage] = useState<number>(1)
  const [searchInput, setSearchInput] = useState<string>()
  const [deployOption, setDeployOption] = useState<string>('Server')
  const [deployConfig, setDeployConfig] = useState<string>('General purpose')
  const [nameInput, setNameInput] = useState<string>()
  const [hasMorePages, setHasMorePages] = useState<boolean>(false)
  const [totalResults, setTotalResults] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMoreTemplates, setIsLoadingMoreTemplates] = useState(false)
  const [progressLoadingBar, setProgressLoadingBar] = useState(0)
  const [progressLoadingText, setProgressLoadingText] = useState(
    'Checking 19 providers'
  )
  const [selected, setSelected] = useState<ValueObject | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<ValueObject | null>(null)

  const { setIndexerDeployerStep, templateSelected, setTemplateSelected } =
    useContext(AccountContext)

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const getData = useCallback(
    async (withoutFilter?: boolean) => {
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
    },
    [page, searchInput]
  )

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
  }, [getData])

  return (
    <section className="relative z-10 pt-[30px] lg:pt-0">
      <div className="mx-auto max-w-[1380px] pl-[85px] text-[14px] font-normal text-[#000]">
        <div className="flex justify-between gap-x-[100px]">
          <div className="mt-[60px]">
            <div className="flex">
              <div
                onClick={() => setDeployOption('Server')}
                className={`relative flex cursor-pointer items-center border-[0.3px] border-[#0354EC] px-[108px] py-[20px] text-center text-[20px] font-normal ${
                  deployOption === 'Server'
                    ? 'bg-[#F2F2F2]'
                    : 'bg-[#fff] hover:bg-[#f5f5f5]'
                }`}
              >
                <div>Server</div>
                {deployOption === 'Server' && (
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/check-now.svg`}
                    alt="image"
                    className={`absolute right-0 top-0 z-50 -translate-y-2 translate-x-2`}
                  />
                )}
              </div>
              <div
                onClick={() => setDeployOption('Storage')}
                className={`relative flex cursor-pointer items-center border-[0.3px] border-[#0354EC] px-[108px] py-[20px] text-center text-[20px] font-normal ${
                  deployOption === 'Storage'
                    ? 'bg-[#F2F2F2]'
                    : 'bg-[#fff] hover:bg-[#f5f5f5]'
                }`}
              >
                <div>Storage</div>
                {deployOption === 'Storage' && (
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/check-now.svg`}
                    alt="image"
                    className={`absolute right-0 top-0 z-50 -translate-y-2 translate-x-2`}
                  />
                )}
              </div>
              <div
                onClick={() => setDeployOption('GPU')}
                className={`relative flex cursor-pointer items-center border-[0.3px] border-[#0354EC] px-[108px] py-[20px] text-center text-[20px] font-normal ${
                  deployOption === 'GPU'
                    ? 'bg-[#F2F2F2]'
                    : 'bg-[#fff] hover:bg-[#f5f5f5]'
                }`}
              >
                <div>GPU</div>
                {deployOption === 'GPU' && (
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/check-now.svg`}
                    alt="image"
                    className={`absolute right-0 top-0 z-50 -translate-y-2 translate-x-2`}
                  />
                )}
              </div>
            </div>
            <div className="mt-[84px]">
              <div className="relative">
                <input
                  value={searchInput}
                  onChange={(e) => {
                    if (e.target.value.length < 1000) {
                      setNameInput(e.target.value)
                    }
                  }}
                  className="h-[60px] w-full rounded-[5px] border border-[#C1C1C1] bg-[#fff] px-[20px] text-[14px] font-normal"
                />
                <div className="absolute -top-3 left-2 z-50 bg-[#fff] px-[10px] text-[16px] font-normal">
                  Name
                </div>
              </div>
              <div className="mt-[57px] flex justify-between">
                <DropdownWithLabel
                  optionSelected={selected}
                  label={'Country'}
                  options={optionsNetwork}
                  placeholder="Select"
                  onValueChange={(value) => {
                    setSelected(value)
                  }}
                />
                <DropdownWithLabel
                  optionSelected={selectedRegion}
                  label={'Region'}
                  options={optionsRegion}
                  placeholder="Select"
                  onValueChange={(value) => {
                    setSelectedRegion(value)
                  }}
                />
              </div>
            </div>
            <div className="mt-[95px]">
              <div className="text-[18px]">Configuration</div>
              <div className="mt-[20px] flex">
                <div
                  onClick={() => setDeployConfig('General purpose')}
                  className={`relative flex cursor-pointer items-center border-[0.3px] border-[#0354EC] px-[45px] py-[5px] text-center text-[18px] font-normal ${
                    deployConfig === 'General purpose'
                      ? 'bg-[#F2F2F2]'
                      : 'bg-[#fff] hover:bg-[#f5f5f5]'
                  }`}
                >
                  <div>General purpose</div>
                  {deployConfig === 'General purpose' && (
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/check-now.svg`}
                      alt="image"
                      className={`absolute right-0 top-0 z-50 -translate-y-2 translate-x-2`}
                    />
                  )}
                </div>
                <div
                  onClick={() => setDeployConfig('Storage optimized')}
                  className={`relative flex cursor-pointer items-center border-[0.3px] border-[#0354EC] px-[45px] py-[5px] text-center text-[18px] font-normal ${
                    deployConfig === 'Storage optimized'
                      ? 'bg-[#F2F2F2]'
                      : 'bg-[#fff] hover:bg-[#f5f5f5]'
                  }`}
                >
                  <div>Storage optimized</div>
                  {deployConfig === 'Storage optimized' && (
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/check-now.svg`}
                      alt="image"
                      className={`absolute right-0 top-0 z-50 -translate-y-2 translate-x-2`}
                    />
                  )}
                </div>
                <div
                  onClick={() => setDeployConfig('GPU optimized')}
                  className={`relative flex cursor-pointer items-center border-[0.3px] border-[#0354EC] px-[45px] py-[5px] text-center text-[18px] font-normal ${
                    deployConfig === 'GPU optimized'
                      ? 'bg-[#F2F2F2]'
                      : 'bg-[#fff] hover:bg-[#f5f5f5]'
                  }`}
                >
                  <div>GPU optimized</div>
                  {deployConfig === 'GPU optimized' && (
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/check-now.svg`}
                      alt="image"
                      className={`absolute right-0 top-0 z-50 -translate-y-2 translate-x-2`}
                    />
                  )}
                </div>
                <div
                  onClick={() => setDeployConfig('CPU optimized')}
                  className={`relative flex cursor-pointer items-center border-[0.3px] border-[#0354EC] px-[45px] py-[5px] text-center text-[18px] font-normal ${
                    deployConfig === 'CPU optimized'
                      ? 'bg-[#F2F2F2]'
                      : 'bg-[#fff] hover:bg-[#f5f5f5]'
                  }`}
                >
                  <div>CPU</div>
                  {deployConfig === 'CPU optimized' && (
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/check-now.svg`}
                      alt="image"
                      className={`absolute right-0 top-0 z-50 -translate-y-2 translate-x-2`}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[10px] w-full border-[0.6px] border-[#d1d5da] py-[10px] lg:mb-0 lg:w-[386px] lg:py-[32px]">
            <div className="flex justify-between px-[32px]">
              <div className="text-[18px] font-bold leading-[40px]">
                Monthly Estimate
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
            <div className="mt-[21px] grid gap-y-[10px] px-[32px]">
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
            <div className="mt-[28px] px-[32px] text-[12px] font-normal">
              2 vCPU + 4 GB memory
            </div>
            <div className="mx-[36px] mt-[26px] flex justify-between bg-gray200 px-[18px] py-[13px] text-[14px] font-normal">
              <div>Item</div>
              <div>Price</div>
            </div>
            <div className="mx-[36px] mt-[30px] flex justify-between border-b border-[#D4D4D4] px-[18px] pb-[5px] text-[12px]">
              <div className="font-normal">2 vCPU + 4 GB memory</div>
              <div className="font-normal">$2,500.00</div>
            </div>
            <div className="mx-[36px] mt-[30px] flex justify-between border-b border-[#D4D4D4] px-[18px] pb-[5px] text-[12px]">
              <div className="font-normal">2 vCPU + 4 GB memory</div>
              <div className="font-normal">$2,500.00</div>
            </div>
            <div className="mx-[36px] mt-[26px] flex justify-between">
              <div className="text-[16px] font-medium">Total</div>
              <div className="text-end">
                <div className="text-[20px] font-normal text-[#000]">
                  $276.97
                </div>
                <div className="text-[12px] font-normal">
                  That's about $0.04 hourly
                </div>
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default FromScratch

/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'
/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from 'react'
import { getAPI, getDatasets } from '@/utils/data'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { TemplatesData, TemplatesProducts } from '@/types/dataProvider'
import { SmileySad } from 'phosphor-react'
import Filter from '@/components/Filter'
import { TextField, Autocomplete } from '@mui/material'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import ProductsList from '../ProductsList'
import Dropdown, { ValueObject } from './Dropdown'
import { AccountContext } from '@/contexts/AccountContext'

export const optionsNetwork = [
  {
    name: 'Date Created',
    value: 'Date Created',
  },
  {
    name: 'Template Name',
    value: 'Template Name',
  },
]

const obj = {
  name: 'Openmesh Core',
  desc: 'CPU, 8-Core (16-Thread)',
  tags: 'Core app',
  infraId: '#262343',
}
export const optionsCreator = [
  {
    name: 'Openmesh',
    value: 'Openmesh',
  },
]

export const providerNameToLogo = {
  Equinix: {
    src: 'new-equinix.png',
    width: 'w-[50px]',
  },
}

const TemplateStep = () => {
  const [templatesData, setTemplatesData] = useState<TemplatesData[]>([])
  const [hoverTemplate, setHoverTemplate] = useState<TemplatesData | null>()
  const [filteredTemplatesData, setFilteredTemplatesData] = useState<TemplatesData[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [displayToggle, setDisplayToggle] = useState<string>('square')
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])

  const [categoryOpen, setCategoryOpen] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [searchInput, setSearchInput] = useState<string>()
  const [filterSelection, setFilterSelection] =
    useState<string>('All Templates')
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<ValueObject | null>(null)
  const [selectedCreator, setSelectedCreator] = useState<ValueObject | null>(
    null,
  )

  const { setIndexerDeployerStep, templateSelected, setTemplateSelected, setIsEditingXnode, setNextFromScratch, setFinalNodes, setNext } =
    useContext(AccountContext)

  async function getData() {
    setIsLoading(true)

    const url = `/openmesh-data/functions/getTemplatesData`

    let data: TemplatesData[]
    try {
      data = await getAPI(url)
    } catch (err) {
      toast.error('Something occured')
    }

    setTemplatesData(data)
    setFilteredTemplatesData(data)
    setIsLoading(false)
  }

  function handleCategoryFilter(ct: string) {
    let newFilter = [...categoryFilter]
    if (newFilter.includes(ct)) {
      newFilter = newFilter.filter((data) => data !== ct)
    } else {
      newFilter.push(ct)
    }
    setCategoryFilter(newFilter)
    handleNewFilteredTemplatesData(newFilter, filterSelection)
  }

  function handleNewFilteredTemplatesData(categories: string[], source: string) {
    // first filtering by the source
    let newFilteredTemplate = [...templatesData]
    if (source !== 'All Templates') {
      newFilteredTemplate = newFilteredTemplate.filter(vl => vl.source === source)
    }

    if (categories.length > 0) {
      newFilteredTemplate = newFilteredTemplate.filter((ft) => categories.includes(ft.category))
    }

    setFilteredTemplatesData(newFilteredTemplate)
  }
  const { push } = useRouter()

  function handleSortByFilter(value: string) {
    console.log('entrei handle')
    if (value === 'Date Created') {
      const newFilteredTemplates = [...filteredTemplatesData]

      newFilteredTemplates.sort((a, b) => {
        // Convert dates to timestamps and compare
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  
      setFilteredTemplatesData(newFilteredTemplates);
    }
    if (value === 'Template Name') {
      console.log('entrei aqui yes sir')
      const newFilteredTemplates = [...filteredTemplatesData]

      newFilteredTemplates.sort((a, b) => a.name.localeCompare(b.name));
      setFilteredTemplatesData(newFilteredTemplates);
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <section className="relative z-10 pt-[30px] pb-[200px] lg:pt-0">
      <div className="mx-auto max-w-[1380px] px-[20px]  2xl:text-[14px] text-[12px] font-normal text-[#000]">
        <div className="flex justify-between gap-x-[95px]">
          <div className="w-full text-center ">
            <div className="mx-auto mb-[12.5px] 2xl:text-[48px] text-[42px] font-semibold leading-[64px]">
              Find your <span className="text-[#0059ff]">Template</span>
            </div>
            <div className="mt-[7px] 2xl:text-[16px] text-[14px] font-normal leading-[32px] text-[#4d4d4d]">
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
              <div className="mx-auto flex w-fit gap-x-[12px] 2xl:text-[16px] text-[14px] font-normal leading-[16px] text-[#4d4d4d]">
                <div
                  onClick={() => {
                    setFilterSelection('All Templates')
                    handleNewFilteredTemplatesData(categoryFilter, 'All Templates')
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
                    setFilterSelection('openmesh')
                    handleNewFilteredTemplatesData(categoryFilter, 'openmesh')
                  }}
                  className={`cursor-pointer rounded-[100px] px-[12px] py-[6px] ${
                    filterSelection === 'openmesh'
                      ? 'bg-[#4d4d4d] font-bold text-[#fff]'
                      : 'hover:text-[#252525]'
                  }`}
                >
                  Openmesh
                </div>
                <div
                  onClick={() => {
                    setFilterSelection('community')
                    handleNewFilteredTemplatesData(categoryFilter, 'community')
                  }}
                  className={`cursor-pointer rounded-[100px] px-[12px] py-[6px] ${
                    filterSelection === 'community'
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
                    <div className="2xl:text-[16px] text-[14px] font-medium leading-[24px] text-[#000]">
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
                    <div onClick={() => {
                      handleCategoryFilter('blockchain')
                    }} className={`cursor-pointer 2xl:text-[16px] text-[14px] font-normal leading-[20px] ${categoryFilter.includes('blockchain') ? 'text-[#0059ff]' : 'text-[#959595]'}`}>
                      Blockchain ({templatesData?.filter((data) => data.category === 'blockchain').length})
                    </div>
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[20px] flex gap-x-[6px]`}
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
                    <div onClick={() => {
                      handleCategoryFilter('data')
                    }} className={`cursor-pointer 2xl:text-[16px] text-[14px] font-normal leading-[20px] ${categoryFilter.includes('data') ? 'text-[#0059ff]' : 'text-[#959595]'}`}>
                      Data ({templatesData?.filter((data) => data.category === 'data').length})
                    </div>
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[20px] flex gap-x-[6px]`}
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
                    <div onClick={() => {
                      handleCategoryFilter('developer')
                    }} className={`cursor-pointer 2xl:text-[16px] text-[14px] font-normal leading-[20px] ${categoryFilter.includes('developer') ? 'text-[#0059ff]' : 'text-[#959595]'}`}>
                      Developer ({templatesData?.filter((data) => data.category === 'developer').length})
                    </div>
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[20px] flex gap-x-[6px]`}
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
                    <div onClick={() => {
                      handleCategoryFilter('server')
                    }} className={`cursor-pointer 2xl:text-[16px] text-[14px] font-normal leading-[20px] ${categoryFilter.includes('server') ? 'text-[#0059ff]' : 'text-[#959595]'}`}>
                      Server ({templatesData?.filter((data) => data.category === 'server').length})
                    </div>
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[20px] flex gap-x-[6px]`}
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
                    <div onClick={() => {
                      handleCategoryFilter('validatorNode')
                    }} className={`cursor-pointer 2xl:text-[16px] text-[14px] font-normal leading-[20px] ${categoryFilter.includes('validatorNode') ? 'text-[#0059ff]' : 'text-[#959595]'}`}>
                     Validator Node ({templatesData?.filter((data) => data.category === 'validatorNode').length})
                    </div>
                  </div>
                </div>
                <div className="mt-[29px] h-[1px] w-full bg-[#E6E8EC]"></div>
                <div className="mt-[24px] text-start">
                  <div className="2xl:text-[16px] text-[14px] font-medium leading-[12px] text-[#000]">
                    Creator
                  </div>
                  <div className="mt-[12px]">
                    <Dropdown
                      optionSelected={selectedCreator}
                      options={optionsCreator}
                      placeholder="Filter"
                      onValueChange={(value) => {
                        setSelectedCreator(value)
                      }}
                    />
                  </div>
                  <div onClick={() => {
                    setCategoryFilter([])
                    setFilterSelection('All Templates')
                    handleNewFilteredTemplatesData([], 'All Templates')
                  }} className="mt-[24px] flex cursor-pointer gap-x-[10px]">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/remove.svg`}
                      alt="image"
                      className=""
                    />
                    <div className="2xl:text-[16px] text-[14px] font-normal text-[#4d4d4d] hover:text-[#3b3b3b]">
                      Reset filter
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
                      handleSortByFilter(value.value)
                    }}
                  />
                  <div className="flex">
                    <div
                      onClick={() => {
                      }}
                      className={`${
                        displayToggle === 'list' ? 'bg-[#0059ff]' : 'bg-[#fff]'
                      } rounded-l-[5px] border-[1px] border-r-0 border-[#d1d5da] p-[16px]`}
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
                        setDisplayToggle('square')
                      }}
                      className={`${
                        displayToggle === 'square'
                          ? 'bg-[#0059ff]'
                          : 'bg-[#fff]'
                      } cursor-pointer rounded-r-[5px] border-[1px] border-l-0 border-[#d1d5da] p-[16px]`}
                    >
                      {displayToggle === 'square' ? (
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
                  {filteredTemplatesData?.findIndex((vl) => vl.featured) !== -1 && (
                    <div className="2xl:text-[18px] text-[16px] font-medium leading-[28px] text-[#000]">
                    Featured
                  </div>
                  )}
                  {isLoading ? (
                    <div className='grid-cols-3 grid'>
                      {[1, 2, 3].map((tmp, index) => (
                      <div
                        key={index}
                        className={`mt-[17px] rounded-[8px] animate-pulse bg-[#e5e5e5] border-[#fafafa] w-[270px] h-[202px] shadow-md`}
                      >
                      
                      </div>
                      ))}
                    </div>
                  ) : (
                    <div className=''>
                      {filteredTemplatesData?.length > 0 ? (
                        <div className='grid-cols-3 grid'>
                        {filteredTemplatesData?.map((tmp, index) => (
                          <a onClick={() => {
                            if (tmp.category === 'scratch') {
                              push(
                                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                  ? `/xnode/start-here`
                                  : `start-here`
                              )
                              setFinalNodes([])
                              localStorage.clear()
                              setIsEditingXnode(false)
                              setNextFromScratch(true)
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            } else {
                              push(
                                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                  ? `/xnode/template-products/${tmp.id}`
                                  : `template-products/${tmp.id}`
                              )
                            }
                              
                          }} key={index} className={`${tmp?.featured ? '' : 'hidden'}`}>
                          <div
                            onMouseEnter={()=> setHoverTemplate(tmp)}
                            onMouseLeave={() => setHoverTemplate(null)}
                            key={index}
                            className={` mt-[17px] bg-[#f1f1f17c] max-w-[270px] w-full cursor-pointer rounded-[8px] border-[#fafafa] py-[27px] px-[22px] shadow-md  border-[2px] hover:border-[#0059ff] hover:bg-[#e5eefc]`}
                          >
                            <div className="flex gap-x-[75px]">
                              {tmp?.logoUrl ? (<img
                                src={tmp.logoUrl}
                                alt="image"
                                className="max-h-[33px] max-w-[33px] w-[33px] h-[33px]"
                              />) : (<img
                                src={`${
                                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                    ? process.env.NEXT_PUBLIC_BASE_PATH
                                    : ''
                                }/images/template/xnode-circle.svg`}
                                alt="image"
                                className="h-[33px] w-[33px]"
                              />)}
                              <div className={`flex w-full items-center gap-x-[9px] rounded-[16px]  px-[12px] py-[4px] ${hoverTemplate?.id === tmp.id ? 'bg-[#fff]' : 'bg-[#e5eefc]'}`}>
                                <div className="h-[10px] w-[10px] rounded-full bg-[#0059ff]"></div>
                                <div className="2xl:text-[14px] text-[12px] font-bold leading-[24px] text-[#0059ff]">
                                  Category
                                </div>
                              </div>
                            </div>
                            <div className="mt-[20px]">
                              <div className="2xl:text-[18px] text-[16px] font-medium text-[#000] line-clamp-1 overflow-hidden">
                                {tmp.name}
                              </div>
                              <div className="mt-[6px] line-clamp-3 overflow-hidden 2xl:text-[16px] text-[14px] font-normal leading-[20px] text-[#959595]">
                                {tmp.description}
                              </div>
                            </div>
                          </div>
                          </a>
                        ))}
                      </div>
                      ) : (
                        <div> </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-[42px] text-start">
                  <div className="2xl:text-[18px] text-[16px] font-medium leading-[28px] text-[#000]">
                    {filteredTemplatesData?.length} Results
                  </div>
                  {isLoading ? (
                    <div className='grid-cols-3 grid'>
                      {[1, 2, 3].map((tmp, index) => (
                      <div
                        key={index}
                        className={`mt-[17px] rounded-[8px] animate-pulse bg-[#e5e5e5] border-[#fafafa] w-[270px] h-[202px] shadow-md`}
                      >
                      
                      </div>
                      ))}
                    </div>
                  ) : (
                    <div className=''>
                      {filteredTemplatesData?.length > 0 ? (
                        <div className='grid-cols-3 grid gap-y-[10px]'>
                        {filteredTemplatesData.map((tmp, index) => (
                          <a key={index} href={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? `/xnode/template-products/${tmp.id}`
                              : `template-products/${tmp.id}`
                          }`} className={`${tmp?.category === 'scratch' && 'hidden'}`}>
                          <div
                            onMouseEnter={()=> setHoverTemplate(tmp)}
                            onMouseLeave={() => setHoverTemplate(null)}
                            key={index}
                            className={` mt-[17px] max-w-[270px] w-full cursor-pointer rounded-[8px] border-[#fafafa] py-[27px] px-[22px] shadow-md  border-[2px] hover:border-[#0059ff] hover:bg-[#e5eefc]`}
                          >
                            <div className="flex gap-x-[75px]">
                              {tmp?.logoUrl ? (<img
                                src={tmp.logoUrl}
                                alt="image"
                                className="max-h-[33px] max-w-[33px] w-[33px] h-[33px]"
                              />) : (<img
                                src={`${
                                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                    ? process.env.NEXT_PUBLIC_BASE_PATH
                                    : ''
                                }/images/template/xnode-circle.svg`}
                                alt="image"
                                className="h-[33px] w-[33px]"
                              />)}
                              <div className={`flex w-full items-center gap-x-[9px] rounded-[16px]  px-[12px] py-[4px] ${hoverTemplate?.id === tmp.id ? 'bg-[#fff]' : 'bg-[#e5eefc]'}`}>
                                <div className="h-[10px] w-[10px] rounded-full bg-[#0059ff]"></div>
                                <div className="2xl:text-[14px] text-[12px] font-bold leading-[24px] text-[#0059ff]">
                                  Category
                                </div>
                              </div>
                            </div>
                            <div className="mt-[20px]">
                              <div className="2xl:text-[18px] text-[16px] font-medium text-[#000] line-clamp-1 overflow-hidden">
                                {tmp.name}
                              </div>
                              <div className="mt-[6px] line-clamp-3 overflow-hidden text-[14px] 2xl:text-[16px] font-normal leading-[20px] text-[#959595]">
                                {tmp.description}
                              </div>
                            </div>
                          </div>
                          </a>
                        ))}
                      </div>
                      ) : (
                        <div className="mt-[17.5px] text-center mx-auto w-full items-center justify-center md:mt-[21px] lg:mt-[24.5px] xl:mt-[28px] 2xl:mt-[35px]">
                        <SmileySad size={32} className="text-blue-500 mb-2 mx-auto flex" />
                        <span className="">No data found</span>
                      </div>
                      )}
                    </div>
                  )}
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

'use client'

import { useContext, useEffect, useState } from 'react'

import 'react-toastify/dist/ReactToastify.css'

import { useRouter } from 'next/navigation'
import { AccountContext } from '@/contexts/AccountContext'
import { prefix } from '@/utils/prefix'
import TemplateDefinitions from 'utils/template-definitions.json'

import { TemplateData } from '@/types/dataProvider'

import Dropdown, { ValueObject } from './Dropdown'

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
  const [templatesData, setTemplatesData] = useState<TemplateData[]>([])
  const [filteredTemplatesData, setFilteredTemplatesData] = useState<
    TemplateData[]
  >([])
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
    null
  )

  const {
    setIndexerDeployerStep,
    templateSelected,
    setTemplateSelected,
    setIsEditingXnode,
    setNextFromScratch,
    setFinalNodes,
    setNext,
  } = useContext(AccountContext)

  async function getData() {
    let data: TemplateData[]
    data = TemplateDefinitions

    setTemplatesData(data)
    setFilteredTemplatesData(data)
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

  function handleNewFilteredTemplatesData(
    categories: string[],
    source: string
  ) {
    // first filtering by the source
    let newFilteredTemplate = [...templatesData]
    if (source !== 'All Templates') {
      newFilteredTemplate = newFilteredTemplate.filter(
        (vl) => vl.source === source
      )
    }

    if (categories.length > 0) {
      newFilteredTemplate = newFilteredTemplate.filter((ft) =>
        categories.includes(ft.category)
      )
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
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      })

      setFilteredTemplatesData(newFilteredTemplates)
    }
    if (value === 'Template Name') {
      console.log('entrei aqui yes sir')
      const newFilteredTemplates = [...filteredTemplatesData]

      newFilteredTemplates.sort((a, b) => a.name.localeCompare(b.name))
      setFilteredTemplatesData(newFilteredTemplates)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <section className="relative z-10 pb-[200px] pt-16">
      <div className="mx-auto max-w-[1380px] px-[20px] text-[12px] font-normal text-black 2xl:text-[14px]">
        <div className="flex justify-between gap-x-[95px]">
          <div className="w-full text-center">
            <div className="mx-auto mb-[12.5px] text-[42px] font-semibold leading-[64px] 2xl:text-[48px]">
              Find your <span className="text-[#0059ff]">Template</span>
            </div>
            <div className="mt-[7px] text-[14px] font-normal leading-[32px] text-[#4d4d4d] 2xl:text-[16px]">
              Jumpstart your development process with our pre-built templates
            </div>
            <div className="relative mt-[48px]">
              <img
                src={`${prefix}/images/template/small.svg`}
                alt="image"
                className="absolute -top-2.5 left-0"
              />
              <div className="mx-auto flex w-fit gap-x-[12px] text-[14px] font-normal leading-[16px] text-[#4d4d4d] 2xl:text-[16px]">
                <div
                  onClick={() => {
                    setFilterSelection('All Templates')
                    handleNewFilteredTemplatesData(
                      categoryFilter,
                      'All Templates'
                    )
                  }}
                  className={`cursor-pointer rounded-[100px] px-[12px] py-[6px] ${
                    filterSelection === 'All Templates'
                      ? 'bg-[#4d4d4d] font-bold text-white'
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
                      ? 'bg-[#4d4d4d] font-bold text-white'
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
                      ? 'bg-[#4d4d4d] font-bold text-white'
                      : 'hover:text-[#252525]'
                  }`}
                >
                  Community
                </div>
              </div>
            </div>
            <div className="mt-[34px] h-px w-full bg-[#E6E8EC]"></div>
            <div className="mt-[30px] flex gap-x-[70px]">
              <div>
                <div className="w-[256px] rounded-[5px] border border-[#d1d5da] px-[16px] pb-[25px] pt-[15px]">
                  <div className="flex items-center justify-between gap-x-[4px]">
                    <div className="text-[14px] font-medium leading-[24px] text-black 2xl:text-[16px]">
                      Category
                    </div>
                    <img
                      onClick={() => {
                        setCategoryOpen(!categoryOpen)
                      }}
                      src={`${prefix}/images/template/arrow-top.svg`}
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
                      src={`${prefix}/images/template/xnode-circle.svg`}
                      alt="image"
                      className=""
                    />
                    <div
                      onClick={() => {
                        handleCategoryFilter('blockchain')
                      }}
                      className={`cursor-pointer text-[14px] font-normal leading-[20px] 2xl:text-[16px] ${categoryFilter.includes('blockchain') ? 'text-[#0059ff]' : 'text-[#959595]'}`}
                    >
                      Blockchain (
                      {
                        templatesData?.filter(
                          (data) => data.category === 'blockchain'
                        ).length
                      }
                      )
                    </div>
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[20px] flex gap-x-[6px]`}
                  >
                    <img
                      src={`${prefix}/images/template/xnode-circle.svg`}
                      alt="image"
                      className=""
                    />
                    <div
                      onClick={() => {
                        handleCategoryFilter('data')
                      }}
                      className={`cursor-pointer text-[14px] font-normal leading-[20px] 2xl:text-[16px] ${categoryFilter.includes('data') ? 'text-[#0059ff]' : 'text-[#959595]'}`}
                    >
                      Data (
                      {
                        templatesData?.filter(
                          (data) => data.category === 'data'
                        ).length
                      }
                      )
                    </div>
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[20px] flex gap-x-[6px]`}
                  >
                    <img
                      src={`${prefix}/images/template/xnode-circle.svg`}
                      alt="image"
                      className=""
                    />
                    <div
                      onClick={() => {
                        handleCategoryFilter('developer')
                      }}
                      className={`cursor-pointer text-[14px] font-normal leading-[20px] 2xl:text-[16px] ${categoryFilter.includes('developer') ? 'text-[#0059ff]' : 'text-[#959595]'}`}
                    >
                      Developer (
                      {
                        templatesData?.filter(
                          (data) => data.category === 'developer'
                        ).length
                      }
                      )
                    </div>
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[20px] flex gap-x-[6px]`}
                  >
                    <img
                      src={`${prefix}/images/template/xnode-circle.svg`}
                      alt="image"
                      className=""
                    />
                    <div
                      onClick={() => {
                        handleCategoryFilter('server')
                      }}
                      className={`cursor-pointer text-[14px] font-normal leading-[20px] 2xl:text-[16px] ${categoryFilter.includes('server') ? 'text-[#0059ff]' : 'text-[#959595]'}`}
                    >
                      Server (
                      {
                        templatesData?.filter(
                          (data) => data.category === 'server'
                        ).length
                      }
                      )
                    </div>
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[20px] flex gap-x-[6px]`}
                  >
                    <img
                      src={`${prefix}/images/template/xnode-circle.svg`}
                      alt="image"
                      className=""
                    />
                    <div
                      onClick={() => {
                        handleCategoryFilter('validatorNode')
                      }}
                      className={`cursor-pointer text-[14px] font-normal leading-[20px] 2xl:text-[16px] ${categoryFilter.includes('validatorNode') ? 'text-[#0059ff]' : 'text-[#959595]'}`}
                    >
                      Validator Node (
                      {
                        templatesData?.filter(
                          (data) => data.category === 'validatorNode'
                        ).length
                      }
                      )
                    </div>
                  </div>
                </div>
                <div className="mt-[29px] h-px w-full bg-[#E6E8EC]"></div>
                <div className="mt-[24px] text-start">
                  <div className="text-[14px] font-medium leading-[12px] text-black 2xl:text-[16px]">
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
                  <div
                    onClick={() => {
                      setCategoryFilter([])
                      setFilterSelection('All Templates')
                      handleNewFilteredTemplatesData([], 'All Templates')
                    }}
                    className="mt-[24px] flex cursor-pointer gap-x-[10px]"
                  >
                    <img
                      src={`${prefix}/images/template/remove.svg`}
                      alt="image"
                      className=""
                    />
                    <div className="text-[14px] font-normal text-[#4d4d4d] hover:text-[#3b3b3b] 2xl:text-[16px]">
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
                      onClick={() => {}}
                      className={`${
                        displayToggle === 'list' ? 'bg-[#0059ff]' : 'bg-white'
                      } rounded-l-[5px] border border-r-0 border-[#d1d5da] p-[16px]`}
                    >
                      {displayToggle === 'list' ? (
                        <img
                          src={`${prefix}/images/template/list.svg`}
                          alt="image"
                          className=""
                        />
                      ) : (
                        <img
                          src={`${prefix}/images/template/list-cinza.svg`}
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
                        displayToggle === 'square' ? 'bg-[#0059ff]' : 'bg-white'
                      } cursor-pointer rounded-r-[5px] border border-l-0 border-[#d1d5da] p-[16px]`}
                    >
                      {displayToggle === 'square' ? (
                        <img
                          src={`${prefix}/images/template/quadrados.svg`}
                          alt="image"
                          className=""
                        />
                      ) : (
                        <img
                          src={`${prefix}/images/template/quadrados-cinza.svg`}
                          alt="image"
                          className=""
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* XXX: Code duplication here. Refactor into component? */}
                <div className="flex size-full flex-wrap">
                  {filteredTemplatesData.map((element, index) => (
                    <a
                      key={index}
                      href={`${prefix}/template-products/${element.id}`}
                    >
                      <div className="mx-5 mt-[17px] min-h-[250px] w-full max-w-[270px] cursor-pointer rounded-[8px] border-2 border-[#fafafa] px-[22px] py-[27px] text-start shadow-md hover:border-[#0059ff] hover:bg-gray200">
                        <div className="flex gap-x-[35px]">
                          <img
                            src={
                              element.logo.startsWith('https://')
                                ? element.logo
                                : `${prefix}${element.logo}`
                            }
                            alt="image"
                            className="size-[33px] max-h-[33px] max-w-[33px]"
                          ></img>
                          <div className="flex w-full items-center gap-x-[9px] rounded-[16px] bg-gray200 px-[12px] py-[4px]">
                            <div className="size-[10px] rounded-full bg-[#0059ff]"></div>
                            <div className="text-[12px] w-min-fit font-bold leading-[24px] text-[#0059ff]">
                              {element.category}
                            </div>
                          </div>
                        </div>
                        <div className="mt-[20px]">
                          <div className="line-clamp-1 overflow-hidden text-[16px] font-medium text-black 2xl:text-[18px]">
                            {element.name}
                          </div>
                          <div className="mt-[6px] line-clamp-3 overflow-hidden text-[14px] font-normal leading-[20px] text-[#959595] 2xl:text-[16px]">
                            {element.desc}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
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

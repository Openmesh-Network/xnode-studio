'use client'

import { useContext, useEffect, useState } from 'react'

import 'react-toastify/dist/ReactToastify.css'

import { useRouter } from 'next/navigation'
import { AccountContext } from '@/contexts/AccountContext'
import { prefix } from '@/utils/prefix'
import CategoryDefinitions from 'utils/category.json'
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

const TemplateStep = ({nftId = ""}) => {
  const [templatesData, setTemplatesData] = useState<TemplateData[]>([])
  const [filteredTemplatesData, setFilteredTemplatesData] = useState<
    TemplateData[]
  >([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [displayToggle, setDisplayToggle] = useState<string>('square')
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const categoryMap: Map<string, number> = new Map(
    Object.entries(CategoryDefinitions)
  )

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
                  <div className={`${!categoryOpen && 'hidden'} mt-[30px] flex flex-col gap-x-[6px] `}>
                    {Array.from(categoryMap.keys()).slice(0, 10).map((category) => (
                      <div key={category} className="mt-6 flex items-center">
                        <img
                          src={`${prefix}/images/template/xnode-circle.svg`}
                          alt="image"
                          className="mr-2" // Adjust margin as needed
                        />
                        <div
                          onClick={() => handleCategoryFilter(category)}
                          className={`cursor-pointer select-none text-[14px] font-normal leading-[20px] 2xl:text-[16px] ${categoryFilter.includes(category) ? 'font-semibold text-black' : 'text-[#959595]'}`}
                        >
                          {category.length > 20 ? `${category.slice(0, 10)}..` : category} ({categoryMap.get(category)})
                        </div>
                      </div>
                      ))}
                  </div>
                </div>
                <div className="mt-[29px] h-px w-full bg-[#E6E8EC]"></div>
              </div>
              <div className="w-full">
                {/* <div className="flex justify-end gap-x-[20px]"> */}
                {/*   <Dropdown */}
                {/*     optionSelected={selected} */}
                {/*     options={optionsNetwork} */}
                {/*     placeholder="Sort By" */}
                {/*     onValueChange={(value) => { */}
                {/*       setSelected(value) */}
                {/*       handleSortByFilter(value.value) */}
                {/*     }} */}
                {/*   /> */}
                {/* </div> */}

                {/* XXX: Code duplication here. Refactor into component? */}
                <div className="flex size-full flex-wrap">
                  {filteredTemplatesData.map((element, index) => (
                    <a key={index} href={
                      prefix + "/deploy?tId=" + element.id + (nftId ? ( "&nftId=" + nftId ) : "")
                      }>
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
                            <div className="w-min-fit text-[12px] font-bold leading-[24px] text-[#0059ff]">
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

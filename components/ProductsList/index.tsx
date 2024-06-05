'use client'

import { useEffect, useMemo, useState } from 'react'

import SingleCard from './SingleCard'

import 'react-toastify/dist/ReactToastify.css'

import { usePathname } from 'next/navigation'
import { Autocomplete, TextField } from '@mui/material'
import { SmileySad } from 'phosphor-react'

import { DataProvider } from '@/types/dataProvider'
import Filter from '@/components/Filter'

type ProductsListProps = {
  dataTestimonial: DataProvider[]
}

const ProductsList = ({ dataTestimonial }: ProductsListProps) => {
  const [testimonial, setTestimonial] = useState<DataProvider[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [viewAll, setViewAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])
  const [selectedOrderBy, setSelectedOrderBy] = useState<string>('')
  const pathname = usePathname()

  const categoriesOptions = [
    'Analytics',
    'Servers',
    'RPC',
    'Compute',
    'Utility',
    'Data',
    'Trading',
    'Storage',
    'Streaming Data',
  ]

  const useCasesOptions = [
    'Financial Analysis',
    'Blockchain Transactions',
    'DEXs and CEXs',
    'Gas Optimization',
    'Crypto Liquidity',
  ]

  const orderByOptions = useMemo(() => ['Most Popular', 'Recently Added'], [])

  const tagsOptions = ['Free', 'Paid']

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const categories = url.searchParams.get('category')?.split(',') || []
      setSelectedCategories(categories)
      const useCases = url.searchParams.get('useCase')?.split(',') || []
      setSelectedUseCases(useCases)
      const orderBy = url.searchParams.get('orderBy')
      console.log(orderBy)
      if (orderBy && orderByOptions.includes(orderBy)) {
        setSelectedOrderBy(orderBy)
      }
    }
    setTestimonial(dataTestimonial)
  }, [dataTestimonial, orderByOptions])

  const handleUpdate = () => {
    // setIsLoading(true)
    // the body that will be passed to call the getTasksFiltered() endpoint
    const dataBody = {}
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)

      const categories = url.searchParams.get('category')?.split(',') || []
      setSelectedCategories(categories)

      const useCases = url.searchParams.get('useCase')?.split(',') || []
      setSelectedUseCases(useCases)

      const orderBy = url.searchParams.get('orderBy')
      console.log(orderBy)
      if (orderBy && orderByOptions.includes(orderBy)) {
        setSelectedOrderBy(orderBy)
      }
    }
  }

  const filteredTestimonials = testimonial?.filter((t) => {
    console.log(t)
    return (
      (selectedCategories.length === 0 ||
        selectedCategories.some((category) => category === t.category)) &&
      (selectedUseCases.length === 0 ||
        selectedUseCases.some((useCase) => t.useCases.includes(useCase))) &&
      (t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })
  let sortedTestimonials = filteredTestimonials
  if (selectedOrderBy === 'Most Popular') {
    sortedTestimonials = filteredTestimonials.sort(
      (a, b) =>
        (b.popularity ? b.popularity : 0) - (a.popularity ? a.popularity : 0)
    )
  } else if (selectedOrderBy === 'Recently Added') {
    sortedTestimonials = filteredTestimonials.sort(
      (a, b) =>
        new Date(b.createdAt || '').getTime() -
        new Date(a.createdAt || '').getTime()
    )
  }
  const testimonialsToShow = viewAll
    ? sortedTestimonials
    : sortedTestimonials?.slice(0, 10)

  const groupByCategory = (testimonials) => {
    return testimonials.reduce((groups, testimonial) => {
      const category = testimonial.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(testimonial)
      return groups
    }, {})
  }

  const groupedTestimonials = groupByCategory(filteredTestimonials)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const searchBar = url.searchParams.get('searchBar')
      if (searchBar && searchBar.length <= 100) setSearchTerm(searchBar)
    }
  }, [pathname])

  if (isLoading) {
    return (
      <section className="mx-auto bg-white px-[30px] pb-[50px] pt-[46px] text-[#000] md:pl-[90px] md:pr-[130px] lg:min-w-[800px] xl:min-w-[1200px] 2xl:min-w-[1200px]">
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
    <section className="flex px-[30px] pb-[55px] pt-[40px] text-[#000] md:pt-[40px] lg:gap-x-[80px] lg:pl-[32px] lg:pr-[120px] 2xl:gap-x-[100px] 2xl:pb-[70px] 2xl:pr-[150px] 2xl:pt-[46px]">
      <div className="hidden md:block">
        <Filter onUpdate={handleUpdate} />
      </div>
      <div>
        <div className="flex h-[32px] min-w-[150px] max-w-[250px] rounded-[5px] border border-[#D9D9D9] bg-white px-[5px] md:h-[40px] md:max-w-[500px] md:px-[15px] md:py-[10px] lg:!leading-[30px] 2xl:h-[50px] 2xl:max-w-[600px]">
          <img
            src={`${
              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                ? process.env.NEXT_PUBLIC_BASE_PATH
                : ''
            }/images/hero/searchVector.svg`}
            alt="image"
            className={`my-auto mr-[10px] md:size-[18px]`}
          />
          <input
            type="text"
            placeholder="Search here"
            className="w-full bg-white text-[8px] font-medium text-black outline-none placeholder:text-[#737373] md:text-[14px] 2xl:text-[16px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-[20px] gap-x-[20px] md:hidden">
          <div className="">
            <Autocomplete
              multiple
              disabled={isLoading}
              className=""
              options={categoriesOptions}
              size="small"
              getOptionLabel={(option) => `${option}`}
              filterOptions={(options, state) =>
                options.filter((option) =>
                  option.toLowerCase().includes(state.inputValue.toLowerCase())
                )
              }
              onChange={(e, newValue) => {
                setSelectedCategories([...newValue])
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props} style={{ fontSize: '10px' }}>
                  {option}
                </li>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <span
                    key={index}
                    {...getTagProps({ index })}
                    style={{
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {option}
                  </span>
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Categories"
                  sx={{
                    width: '250px',
                    minHeight: '30px', // Defina um minHeight adequado
                    fontSize: '10px',
                    fieldset: {
                      borderColor: '#D4D4D4',
                      borderRadius: '3px',
                    },
                    input: {
                      color: 'black',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap', // Permite que o conteúdo do input se ajuste à altura
                    },
                  }}
                />
              )}
            />
          </div>
          <div className="mt-[10px]">
            <Autocomplete
              multiple
              disabled={isLoading}
              className=""
              options={useCasesOptions}
              size="small"
              getOptionLabel={(option) => `${option}`}
              filterOptions={(options, state) =>
                options.filter((option) =>
                  option.toLowerCase().includes(state.inputValue.toLowerCase())
                )
              }
              onChange={(e, newValue) => {
                setSelectedUseCases([...newValue])
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props} style={{ fontSize: '10px' }}>
                  {option}
                </li>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <span
                    key={index}
                    {...getTagProps({ index })}
                    style={{
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {option}
                  </span>
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Use cases"
                  sx={{
                    width: '250px',
                    minHeight: '30px', // Defina um minHeight adequado
                    fontSize: '10px',
                    fieldset: {
                      borderColor: '#D4D4D4',
                      borderRadius: '3px',
                    },
                    input: {
                      color: 'black',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap', // Permite que o conteúdo do input se ajuste à altura
                    },
                  }}
                />
              )}
            />
          </div>
        </div>
        <div
          id="experts"
          className="mt-[10px] text-[8px] font-medium text-[#959595] md:text-[9px] lg:text-[11px] lg:!leading-[17px] 2xl:mt-[12px] 2xl:text-[14px]"
        >
          Showing {testimonialsToShow?.length} out of {testimonial?.length} apps
          by most popular
        </div>
        {testimonialsToShow?.length === 0 ? (
          <div>
            <div className="mb-[100px] mt-[64px] flex items-center justify-center">
              <SmileySad size={32} className="text-blue-500 mb-2" />
              <span>No datasets found</span>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="mt-[30px] grid gap-y-[41px] md:gap-y-[50px] lg:gap-y-[58px] xl:gap-y-[67px] 2xl:gap-y-[83px]">
          {Object.keys(groupedTestimonials).map((category) => (
            <div key={category}>
              <div className="text-lg font-bold text-[#505050] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
                {category}
              </div>
              <div className="mt-[20px] grid grid-cols-1 gap-x-[25px] gap-y-[15px] md:mt-[24px] lg:mt-[28px] lg:grid-cols-2 lg:gap-x-[28px] lg:gap-y-[21px] xl:mt-[32px] 2xl:mt-[40px]">
                {groupedTestimonials[category].map((testimonial, index) => (
                  <SingleCard key={index} {...testimonial} />
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* <div
          onClick={() => {
            if (viewAll) {
              const element = document.getElementById('experts')
              element.scrollIntoView({ behavior: 'smooth' })
            }
            setViewAll(!viewAll)
          }}
          className="mt-[31px] flex cursor-pointer  justify-center text-[8px] font-medium -tracking-[2%] text-[#959595] hover:text-[#686767] md:text-[13px] lg:!leading-[200%] xl:text-[15px] 2xl:text-[18px]"
        >
          {viewAll ? 'Show less' : 'Show more'}
        </div> */}
        <div className="md:hidden">
          <div className="mt-[25px] border-b border-[#D9D9D9] pb-[8px] text-[8px] lg:mt-[12px] lg:pb-[12px] 2xl:mt-[15px] 2xl:pb-[15px]">
            <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
              Suggest a new data
            </div>
            <div className="lg:!leading-[150%]">
              <a
                href={'https://www.openmesh.network/oec/register'}
                target="_blank"
                className="border-b font-medium text-[#0354EC]"
                rel="noreferrer"
              >
                Join our community and let us know what you’d like to add!
              </a>
            </div>
          </div>
          <div className="mt-[8px] pb-[8px] text-[8px] lg:mt-[12px] lg:pb-[12px] 2xl:mt-[15px] 2xl:pb-[15px]">
            <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
              Provide a data source
            </div>
            <div className="lg:!leading-[150%]">
              {' '}
              <a className="border-b font-medium text-[#0354EC]">
                Run an Xnode today{' '}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductsList

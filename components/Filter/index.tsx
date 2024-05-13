/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { getDatasets } from '@/utils/data'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DataProvider } from '@/types/dataProvider'
import { SmileySad } from 'phosphor-react'
import { TextField, Autocomplete } from '@mui/material'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

interface ModalProps {
  onUpdate(): void
}

const Filter = ({ onUpdate }: ModalProps) => {
  const [testimonial, setTestimonial] = useState<DataProvider[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [viewAll, setViewAll] = useState(false)
  const [filterCategories, setFilterCategories] = useState<string[]>([])
  const [filterUseCases, setFilterUseCases] = useState<string[]>([])
  const [filterOrderBy, setFilterOrderBy] = useState<string>('')

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

  const orderByOptions = ['Most Popular', 'Recently Added']

  const useCasesOptions = [
    'Financial Analysis',
    'Blockchain Transactions',
    'DEXs and CEXs',
    'Gas Optimization',
    'Crypto Liquidity',
  ]

  const pathname = usePathname()

  const handleOrderBySelection = (value: string | null) => {
    if (value === filterOrderBy) {
      setFilterOrderBy('')
      updateUrl('orderBy', '')
      return
    }
    setFilterOrderBy(value)
    updateUrl('orderBy', value)
  }

  const handleCategorySelection = (category: string) => {
    setFilterCategories((prevCategories) => {
      const updatedCategories = prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]

      updateUrl('category', updatedCategories.join(','))

      return updatedCategories
    })
  }

  const handleUseCaseSelection = (useCase: string) => {
    setFilterUseCases((prevUseCases) => {
      const updatedUseCases = prevUseCases.includes(useCase)
        ? prevUseCases.filter((cat) => cat !== useCase)
        : [...prevUseCases, useCase]

      updateUrl('useCase', updatedUseCases.join(','))

      return updatedUseCases
    })
  }

  const updateUrl = (param: string, value: string | null) => {
    if (param !== 'page') {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.delete('page')
        window.history.pushState({}, '', url.toString())
      }
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)

      if (value) {
        url.searchParams.set(param, value)
      } else {
        url.searchParams.delete(param)
      }

      window.history.pushState({}, '', url.toString())
      onUpdate()
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const categories = url.searchParams.get('category')
      if (categories) {
        setFilterCategories(categories.split(','))
      }
      const useCases = url.searchParams.get('useCase')
      if (useCases) {
        setFilterUseCases(useCases.split(','))
      }
      const orderBy = url.searchParams.get('orderBy')
      if (orderBy) {
        setFilterOrderBy(orderBy)
      }
    }
  }, [pathname])

  return (
    <section className="max-w-[190px] bg-white p-[5px] text-[8px] font-normal text-[#000] md:text-[11px] lg:min-w-[200px] lg:pt-[100px] lg:text-[13px] lg:!leading-[220%] 2xl:max-w-[220px] 2xl:text-[14px]">
      {/* <div className="lg:!leading-[200%]">
        <div className="mt-[8px] lg:mt-[12px] 2xl:mt-[15px]">
          {orderByOptions.map((order, index) => (
            <div
              onClick={() => {
                handleOrderBySelection(order)
              }}
              key={index}
              className={`cursor-pointer hover:text-[#000] ${
                filterOrderBy === order ? 'text-[#000]' : 'text-[#959595]'
              }`}
            >
              {order}
            </div>
          ))}
        </div>
      </div> */}
      <div className="mt-[20px] lg:mt-[32px] 2xl:mt-[40px]">
        <div className="border-b-[1px] border-[#D9D9D9] pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
          Categories
        </div>
        <div className="mt-[8px] lg:mt-[12px] 2xl:mt-[15px]">
          {categoriesOptions.map((category, index) => (
            <div
              onClick={() => {
                handleCategorySelection(category)
              }}
              key={index}
              className={`hidden cursor-pointer hover:text-[#000] ${
                filterCategories.includes(category) && '!block text-[#000]'
              } ${filterCategories.length === 0 && '!block text-[#000]'}`}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-[20px] border-b-[1px] border-[#D9D9D9] pb-[20px] lg:mt-[32px] lg:pb-[32px] 2xl:mt-[40px] 2xl:pb-[40px]">
        <div className="border-b-[1px] border-[#D9D9D9] pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
          Use Cases
        </div>
        <div className="mt-[8px] lg:mt-[12px] 2xl:mt-[15px]">
          {useCasesOptions.map((useCase, index) => (
            <div
              onClick={() => {
                handleUseCaseSelection(useCase)
              }}
              key={index}
              className={`cursor-pointer hover:text-[#000] ${
                filterUseCases.includes(useCase)
                  ? 'text-[#000]'
                  : 'text-[#959595]'
              }`}
            >
              {useCase}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-[8px] border-b-[1px] border-[#D9D9D9] pb-[8px] lg:mt-[12px] lg:pb-[12px] 2xl:mt-[15px] 2xl:pb-[15px]">
        <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
          Suggest a new data
        </div>
        <div className=" lg:!leading-[150%]">
          <a
            href={'https://www.openmesh.network/oec/register'}
            target="_blank"
            className="border-b-[1px] font-medium text-[#0354EC]"
            rel="noreferrer"
          >
            Join our community and let us know what you’d like to add!
          </a>
        </div>
      </div>
      <div className="mt-[8px] pb-[8px] lg:mt-[12px] lg:pb-[12px] 2xl:mt-[15px] 2xl:pb-[15px]">
        <div className="pb-[8px] font-bold lg:pb-[12px] lg:leading-[19px] 2xl:pb-[15px]">
          Provide a data source
        </div>
        <div className=" lg:!leading-[150%]">
          {' '}
          <a className="border-b-[1px] font-medium text-[#0354EC]">
            Run an Xnode today{' '}
          </a>
        </div>
      </div>
    </section>
  )
}

export default Filter

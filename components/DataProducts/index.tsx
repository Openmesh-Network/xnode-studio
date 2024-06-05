'use client'

import { useEffect, useState } from 'react'
import { getDatasets } from '@/utils/data'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import { DataProvider } from '@/types/dataProvider'

import ProductsList from '../ProductsList'

const DataProducts = () => {
  const [testimonial, setTestimonial] = useState<DataProvider[]>([])
  const [isLoading, setIsLoading] = useState(false)

  async function getData() {
    setIsLoading(true)

    let data: DataProvider[]
    try {
      data = await getDatasets('data')
    } catch (err) {
      toast.error('Something occured')
    }
    setIsLoading(false)
    setTestimonial(data)
  }

  useEffect(() => {
    getData()
  }, [])

  if (isLoading) {
    return (
      <section className="bg-white px-[30px] pb-[50px] pt-[46px] text-[#000] md:pl-[90px] md:pr-[130px]">
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
    <section>
      <ProductsList dataTestimonial={testimonial} />
    </section>
  )
}

export default DataProducts

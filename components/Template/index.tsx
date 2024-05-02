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
import { AccountContext } from '@/contexts/AccountContext'
import Signup from '../Signup'
import FinalBuild from '../FinalBuild'
import Template from './TemplatePage'
import TemplateProducts from '../TemplateProducts/FirstStep'
import Configuration from '../TemplateProducts/SecondStep'

const IndexerDeployer = (id: any) => {
  const { indexerDeployerStep } = useContext(AccountContext)

  if (indexerDeployerStep === -1) {
    return <Template id={id} />
  }
  if (indexerDeployerStep === 0) {
    return <TemplateProducts />
  }
  if (indexerDeployerStep === 1) {
    return <Configuration />
  }
  if (indexerDeployerStep === 2) {
    return (
      <>
        <div className="mx-auto rounded-[10px] bg-[#F9F9F9] xl:w-[1200px] 2xl:w-[1500px] ">
          <Signup />
        </div>
      </>
    )
  }
  if (indexerDeployerStep === 3) {
    return (
      <>
        <div className="mx-auto rounded-[10px] xl:w-[1200px] 2xl:w-[1500px]">
          <FinalBuild />
        </div>
      </>
    )
  }
}

export default IndexerDeployer

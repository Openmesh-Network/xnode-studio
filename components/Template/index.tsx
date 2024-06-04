/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'

/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react'
import { getAPI, getDatasets } from '@/utils/data'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AccountContext } from '@/contexts/AccountContext'
import { Autocomplete, TextField } from '@mui/material'
import { SmileySad } from 'phosphor-react'

import { TemplatesProducts } from '@/types/dataProvider'
import Filter from '@/components/Filter'

import FinalBuild from '../FinalBuild'
import ProductsList from '../ProductsList'
import Signup from '../Signup'
import TemplateProducts from '../TemplateProducts/FirstStep'
import Configuration from '../TemplateProducts/SecondStep'
import Template from './TemplatePage'

const IndexerDeployer = (id: any) => {
  const { indexerDeployerStep } = useContext(AccountContext)

  if (indexerDeployerStep === -1) {
    return <Template id={id} />
  }
  if (indexerDeployerStep === 0) {
    return <TemplateProducts />
  }
  // if (indexerDeployerStep === 1) {
  //   return <Configuration />
  // }
  if (indexerDeployerStep === 1) {
    return (
      <>
        <div className="mx-auto rounded-[10px] bg-[#F9F9F9] xl:w-[1200px] 2xl:w-[1500px]">
          <Signup />
        </div>
      </>
    )
  }
  if (indexerDeployerStep === 2) {
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

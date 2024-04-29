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
import Dropdown, { ValueObject } from './Dropdown'
import { AccountContext } from '@/contexts/AccountContext'
import TemplateProducts from './FirstStep'
import Configuration from './SecondStep'

const IndexerDeployer = () => {
  const { indexerDeployerStep } = useContext(AccountContext)

  if (indexerDeployerStep === 0) {
    return <TemplateProducts />
  }
  if (indexerDeployerStep === 1) {
    return <Configuration />
  }
}

export default IndexerDeployer

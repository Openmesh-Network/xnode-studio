'use client'

import { useContext } from 'react'

import 'react-toastify/dist/ReactToastify.css'

import { AccountContext } from '@/contexts/AccountContext'

import FinalBuild from '../FinalBuild'
import Signup from '../Signup'
import TemplateProducts from '../TemplateProducts/FirstStep'
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

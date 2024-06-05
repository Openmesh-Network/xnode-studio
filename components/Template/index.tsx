'use client'

import { useContext } from 'react'

import 'react-toastify/dist/ReactToastify.css'

import { AccountContext } from '@/contexts/AccountContext'

import TemplateProgress from '@/app/template-products/template-progress'

import FinalBuild from '../FinalBuild'
import Signup from '../Signup'
import TemplateProducts from '../TemplateProducts/FirstStep'
import Template from './TemplatePage'

const IndexerDeployer = (id: any) => {
  const { indexerDeployerStep } = useContext(AccountContext)

  return (
    <div className="flex h-full">
      <div className="m-20 grow">
        {indexerDeployerStep === -1 ? <Template id={id} /> : null}
        {indexerDeployerStep === 0 ? <TemplateProducts /> : null}
        {indexerDeployerStep === 1 ? <Signup /> : null}
        {indexerDeployerStep === 2 ? <FinalBuild /> : null}
      </div>
      <TemplateProgress />
    </div>
  )
}

export default IndexerDeployer

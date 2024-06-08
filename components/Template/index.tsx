'use client'

import { useContext } from 'react'
import { AccountContext } from '@/contexts/AccountContext'

import TemplateProgress from '@/app/template-products/template-progress'

import FinalBuild from '../FinalBuild'
import Signup from '../Signup'
import TemplateProducts from '../TemplateProducts/FirstStep'
import DeploymentTemplate from './TemplatePage'

const IndexerDeployer = (id: any) => {
  const { indexerDeployerStep } = useContext(AccountContext)

  return (
    <div className="flex h-full">
      <div className="m-20 flex-1">
        {indexerDeployerStep === -1 ? <DeploymentTemplate id={id} /> : null}
        {indexerDeployerStep === 0 ? <TemplateProducts /> : null}
        {indexerDeployerStep === 1 ? <Signup /> : null}
        {indexerDeployerStep === 2 ? <FinalBuild /> : null}
      </div>
      <TemplateProgress />
    </div>
  )
}

export default IndexerDeployer

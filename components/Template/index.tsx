'use client'

import { useContext } from 'react'
import { AccountContext } from '@/contexts/AccountContext'

import TemplateProgress from '@/app/template-products/template-progress'

import FinalBuild from '../FinalBuild'
import Signup from '../Signup'
import TemplateProducts from '../TemplateProducts/FirstStep'
import Template from './TemplatePage'
import NewIntegrationConn from '../Signup/NewIntegrationConn'

const IndexerDeployer = (id: any) => {
  const { indexerDeployerStep } = useContext(AccountContext)

  return (
    <div className="flex h-full">
      <div className="m-20 flex-1">
        {indexerDeployerStep === -1 ? <Template id={id} /> : null}

        { /* TODO: If deploying a unit skip this stuff. */ }
        {indexerDeployerStep === 0 ? <TemplateProducts /> : null}

        { /* TODO: If deploying a unit skip this stuff. */ }
        {indexerDeployerStep === 1 ? <Signup /> : null}

        { /* TODO: Add back the connection / api stage here. */ }

        {indexerDeployerStep === 2 ? <NewIntegrationConn /> : null}

        { /* TODO: If deploying a unit skip this stuff. */ }
        {indexerDeployerStep === 3 ? <FinalBuild /> : null}
      </div>
      <TemplateProgress />
    </div>
  )
}

export default IndexerDeployer

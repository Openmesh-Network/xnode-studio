'use client'

import { useContext } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import { z } from 'zod'

import ReviewYourBuild from '@/components/FinalBuild'
import Signup from '@/components/Signup'
import DeploymentTemplate from '@/components/Template/TemplatePage'
import TemplateProducts from '@/components/TemplateProducts/FirstStep'

import DeploymentProgress from './progress-sidebar'

type DeployPageProps = {
  searchParams: {
    tId: string
    workspace: boolean
  }
}
export default function DeployPage({ searchParams }: DeployPageProps) {
  const { indexerDeployerStep } = useContext(AccountContext)

  const tId = z.string().parse(searchParams.tId)
  const workspace = z.coerce.boolean().parse(searchParams.workspace)

  return (
    <div className="flex h-full">
      <div className="m-20 flex-1">
        {indexerDeployerStep === -1 ? (
          <DeploymentTemplate id={tId} workspace={workspace} />
        ) : null}
        {indexerDeployerStep === 0 ? <TemplateProducts /> : null}
        {indexerDeployerStep === 1 ? <Signup /> : null}
        {indexerDeployerStep === 2 ? <ReviewYourBuild /> : null}
      </div>
      <DeploymentProgress />
    </div>
  )
}

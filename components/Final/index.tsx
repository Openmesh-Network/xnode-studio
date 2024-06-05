/* eslint-disable no-unused-vars */
'use client'

import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AccountContext } from '@/contexts/AccountContext'

import Connections from '../Connections'
import Dropdown from '../Dropdown'
import FinalBuild from '../FinalBuild'
import LatencySelector from '../LatencySelector'
import NodesFlow from '../NodesFlow'
import Signup from '../Signup'

/* eslint-disable react/no-unescaped-entities */
const Final = () => {
  const [presetId, setPresetId] = useState(0)
  const {
    selectionSideNavBar,
    setSelectionSideNavBar,
    next,
    setNext,
    reviewYourBuild,
    setReviewYourBuild,
    setNextFromScratch,
    nextFromScratch,
    connections,
    finalBuild,
    setIsEditingXnode,
    setXnodeType,
    setFinalNodes,
    signup,
  } = useContext(AccountContext)
  const { push } = useRouter()

  if (finalBuild) {
    return (
      <>
        <div className="mx-auto rounded-[10px] xl:w-[1200px] 2xl:w-[1500px]">
          <FinalBuild />
        </div>
      </>
    )
  }

  if (connections) {
    return (
      <>
        <div className="rounded-[10px] xl:w-[1200px] 2xl:w-[1500px]">
          <Connections />
        </div>
      </>
    )
  }

  if (signup) {
    return (
      <>
        <div className="mx-auto rounded-[10px] bg-[#F9F9F9] xl:w-[1200px] 2xl:w-[1500px]">
          <Signup />
        </div>
      </>
    )
  }
}

export default Final

import { XnodeConfig } from "./dataProvider"
export type CoreServices = {
  name: string
  isFree: boolean
  chain: string
  description: string
}

export type HeartbeatData = {
 id: string
 cpuPercent: number
 cpuPercentPeek: number
 ramMbUsed: number
 ramMbPeek: number
 ramMbTotal: number

 storageMbUsed: number
 storageMbTotal: number

 wantUpdate?: boolean
}

export type Xnode = {
  id: string

  provider: string
  services: XnodeConfig

  heartbeatData?: HeartbeatData

  name: string
  description: string
  status: string
  deploymentAuth: string
  openmeshExpertUserId: string

  ipAddress: string

  isUnit: boolean
  unitClaimTime: Date

  updateGenerationWant: number
  updateGenerationHave: number
  configGenerationWant: number
  configGenerationHave: number

  nftId: string
  location: string
  createdAt: Date
  updatedAt: Date
}

type Stats = {
  totalValidators: number
  totalStakeAmount: number
  totalAverageReward: number
  averagePayoutPeriod: string
}

export type XnodeValidatorsStats = {
  stats: Stats
  nodes: Xnode[]
}

export type XnodeWithValidatorsStats = {
  node: Xnode
  stats: Stats
  nodes: Xnode[]
}

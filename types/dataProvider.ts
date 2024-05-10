export type DataProvider = {
  id: string
  name?: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
  tags?: string[]
  useCases?: string[]
  live: boolean
  download: boolean
  isThirdParty: boolean
  free: boolean
  dataGithubName?: string
  dataGithubLink?: string
  dataCloudLink?: string
  dataCloudName?: string
  category?: string
  dataSpace?: string
  location?: string
  foundingYear?: string
  addToXnodeMessage?: string
  relevantDocs?: string
  logoURL?: string
  specification?: string
  details?: string
  website?: string
  downloadCSVLink?: string
  type?: string
  liveLink?: string
  company?: string
  popularity?: number
  sql?: string
  linkDevelopersDocs?: string
  linkProducts?: string
  linkCareers?: string
  linkTwitter?: string
  linkContact?: string
  linkAboutUs?: string
  linkMedium?: string
  linkLinkedin?: string
  linkGithub?: string
}

export type TemplatesProducts = {
  id: string
  providerName?: string
  productName?: string
  location?: string
  cpuCores?: string
  cpuThreads?: string
  cpuGHZ?: string
  hasSGX?: string
  ram?: string
  numberDrives?: string
  avgSizeDrive?: string
  storageTotal?: string
  gpuType?: string
  gpuMemory?: string
  bandwidthNetwork?: string
  network?: string
  priceHour?: string
  priceMonth?: string
  availability?: string
  source?: string
  unit?: string
}

export type IncludedProducts = {
  name?: string
  description?: string
  tags?: string
  infraId?: string
}

export type IncludedIntegrations = {
  name?: string
  description?: string
}

export type TemplatesData = {
  id: string
  name?: string
  description?: string
  price?: string
  logoUrl?: string
  tags?: string[]
  systemMinRequirements?: string
  systemRecommendedRequirements?: string
  productsIncluded?: any[]
  techDiagrams?: string
  source?: string
  featured?: boolean
  category?: string
  createdAt?: string
  includedProducts?: IncludedProducts[]
  includedIntegrations?: IncludedIntegrations[]
}

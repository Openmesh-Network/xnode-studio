import ServiceDefinitions from 'utils/service-definitions.json'
import TemplateDefinitions from 'utils/template-definitions.json'

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

export type OldTemplatesData = {
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

export type DeploymentConfiguration = {
  name: string,
  desc: string;
  location: string,
  isUnit: boolean,
  provider: string,

  // An array to all the service ids being looked at.
  services: ServiceData[]
}

export type ServiceOption = {
  name: string
  desc: string

  // Nix name for the option.
  nixName: string

  // One of: "string", "int", "float", "bool"
  type: string
  value: string
}

export type Specs = {
  // cores: number
  ram: number
  storage: number
}

export type ServiceData = {
  name: string;
  tags: string[];
  specs: Specs;
  desc: string
  // Url to the logo.
  logo?: string

  nixName: string
  options: ServiceOption[]
}

export type TemplateData = {
  id: string;
  name: string;
  desc: string;
  tags: string[];
  source?: string;

  // Url to image.
  logo: string;
  category: string;
  dateAdded: string;
  // An array to all the service ids being looked at.
  serviceNames: string[]
}

let serviceMap: Map<string, ServiceData> = null
export function ServiceFromName(name: string): ServiceData | undefined {
  if (serviceMap == null) {
    serviceMap = new Map<string, ServiceData>()

    for (let i = 0; i < ServiceDefinitions.length; i++) {
      serviceMap.set(ServiceDefinitions[i].name, ServiceDefinitions[i])
    }
  }

  return serviceMap.get(name)
}

let templateMap: Map<string, TemplateData> = null
export function TemplateFromId(id: string): TemplateData | undefined {
  if (templateMap == null) {
    console.log("Inicialisando mapa.")
    templateMap = new Map<string, TemplateData>()

    console.log("Tamano ", TemplateDefinitions.length)
    for (let i = 0; i < TemplateDefinitions.length; i++) {
      console.log("Seteando ", TemplateDefinitions[i].id, id)
      templateMap.set(TemplateDefinitions[i].id, TemplateDefinitions[i])
      console.log("Viene:", templateMap.get(TemplateDefinitions[i].id))
    }
  }

  console.log("Ahora vuelve el resultado.", templateMap.get(id))
  return templateMap.get(id)
}

export function  TemplateGetSpecs(template: TemplateData): Specs {
  let specs: Specs = { ram: 0, storage: 0 }

  for (let i = 0; i < template.serviceNames.length; i++) {
    // Get service id from .
    const service = ServiceFromName(template.serviceNames[i])
    if (service) {
      // specs.cores += service.specs.cores
      specs.ram += service.specs.ram
      specs.storage += service.specs.storage
    } else {
      // XXX: Need a test to quality check all templates ahead of time.
      console.log("This shouldn't run")
    }
  }

  return specs
}

export function  TemplateGetTags(template: TemplateData): string[] {
  let ret: string[] = []

  for (let i = 0; i < template.serviceNames.length; i++) {
    // Get service id from .
    const service = ServiceFromName(template.serviceNames[i])
    if (service) {
      // specs.cores += service.specs.cores
      for (let j = 0; j < service.tags.length; j++) {
        ret.push(service.tags[j])
      }
    } else {
      // XXX: Need a test to quality check all templates ahead of time.
      console.log("This shouldn't run")
    }
  }

  return ret
}

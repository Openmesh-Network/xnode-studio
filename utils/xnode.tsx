import axios from 'axios'
import { ServiceData } from '@/types/dataProvider'
import {
  ServiceFromName,
  ServiceOption,
} from '@/types/dataProvider'

export async function getDataXnodeValidatorsInfo() {
  const config = {
    method: 'get' as 'get',
    url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/getNodesValidatorsStats`,
    headers: {
      'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
      'Content-Type': 'application/json',
    },
  }
  let dado

  await axios(config).then(function (response) {
    if (response.data) {
      dado = response.data
    }
  })
  return dado
}

export async function getXnodeWithNodesValidatorsStats(id: any) {
  const data = {
    id,
  }

  const config = {
    method: 'post' as 'post',
    url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/getXnodeWithNodesValidatorsStats`,
    headers: {
      'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
      'Content-Type': 'application/json',
    },
    data,
  }
  let dado

  await axios(config).then(function (response) {
    if (response.data) {
      dado = response.data
    }
  })
  return dado
}

export function servicesCompressedForAdmin(services: ServiceData[]): ServiceData[] {
  let newServices = []

  for (const service of services) {
    if (service.nixName != "openssh") {

      const processOption = (option: ServiceOption, parentOptions: ServiceOption[], targetOptions: ServiceOption[]) => {

        const defaultOption = parentOptions?.find(defOption => defOption.nixName === option.nixName);

        if (option.options) {
          let newSubOptions = []
          for (let j = 0; j < option.options.length; j++) {
            processOption(option.options[j], defaultOption?.options, newSubOptions)
          }

          option.options = newSubOptions

          delete option.value
        }

        delete option.name
        delete option.desc

        targetOptions.push(option)
      }

      console.log(service)

      let newServiceOptions = []
      console.log("Service length: ", service.options.length)
      const defaultService = ServiceFromName(service.nixName)
      for (let i = 0; i < service.options.length; i++) {
        // Process all the top level options at least once.
        // If they have options then we recurse.
        processOption(service.options[i], defaultService.options, newServiceOptions)
        console.log("Processing option: ", i)
      }

      service.options = newServiceOptions;
      newServices.push(service)
      console.warn("Final options again: ", service.options)
    }
  }


  return newServices
}

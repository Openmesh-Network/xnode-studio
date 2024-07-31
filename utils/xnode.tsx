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
      let defaultservice = ServiceFromName(service.nixName)
      console.log(service)

      const processOption = (option: ServiceOption, targetOptions: ServiceOption[]) => {
        if (option.options) {
          delete option.value

          let newSubOptions = []
          for(let i = 0; i < option.options.length; i++) {
            processOption(option.options[i], newSubOptions)
          }

          option.options = newSubOptions
        }

        delete option.desc
        delete option.name

        const defaultOption = defaultservice.options.find(defOption => defOption.name === option.name);
        console.log(defaultOption?.value, option.value)

        if ((option.value !== "" && option.value !== "null" && option.value !== null && defaultOption && option.value !== defaultOption.value) || option.type == "boolean") {
          targetOptions.push(option)
        }
      }

      let newServiceOptions = []
      for (let i = 0; i < service.options.length; i++) {
        // Process all the top level options at least once.
        // If they have options then we recurse.
        if (service.options) {
          processOption(service.options[i], newServiceOptions)
          console.log("Processing option: ", i)
        }
      }

      alert("Length of final options: " + newServiceOptions.length)
      service.options = newServiceOptions;
      newServices.push(service)
    }
  }

  return newServices
}

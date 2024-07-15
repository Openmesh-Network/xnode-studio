'use client'

import { AccountContext } from '@/contexts/AccountContext'
import { z } from 'zod'

/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useUser } from 'hooks/useUser'
import {
  ServiceFromName,
} from '@/types/dataProvider'
import Signup from '@/components/Signup'
import { HeartbeatData, Xnode } from '../../types/node'

import Image from 'next/image'
import { useDraft } from '@/hooks/useDraftDeploy'
import Loading from '@/components/Loading'
import SectionHeader from '@/components/SectionHeader'
import ServiceEditor from '@/components/Deployments/serviceEditor'
import ServiceAccess from '@/components/Deployments/serviceAccess'
import { ServiceData, XnodeConfig } from '@/types/dataProvider'
import { Button } from '@/components/ui/button'
import stackIcon from '@/assets/stack.svg'

import './page.css'

type XnodePageProps = {
  searchParams: {
    uuid: string
  }
}

const XnodeMeasurement = ({ name, unit, isAvailable, used, available, usedPercent }: { used: number, available: number, usedPercent: number, unit: string, name: string, isAvailable: boolean }) => {

  const upperCaseFirstLetter = (str: string) => {

    let newStr = "";

    newStr += str[0].toUpperCase();
    newStr += str.slice(1, str.length);
    return newStr
  }

  return (
    <div className="flex-1">
      <p className="font-medium"> {upperCaseFirstLetter(name)} </p>
      <div className="w-full flex">
        { /* TODO: Add icon */}
        <div className="w-10 h-10 mr-2">
          <Image src={stackIcon} alt={"Stack icon"} />
        </div>

        <div className="bg-gray-200 flex-1 flex align-middle min-h-5">

          {
            isAvailable ? (
              <>
                <div className="bg-blue-500 h-full" style={{ width: usedPercent + "%" }}>
                </div>

                <div className="w-fit p-2">
                  <p> {available + unit + " "} left </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-fit p-2">
                  <p> No {name} data available. </p>
                </div>
              </>
            )
          }
        </div>
      </div>
      {
        isAvailable && (
          <p className="ml-12"> {used + unit} </p>
        )
      }
    </div>
  )
}

export default function XnodePage({ searchParams }: XnodePageProps) {
  const opensshconfig = {
    "nixName": "openssh",
    "options": [{ "nixName": "enable", "type": "boolean", "value": "true" },
    { "nixName": "settings.PasswordAuthentication", "value": "false", "type": "boolean" }, { "nixName": "settings.KbdInteractiveAuthentication", "value": "false", "type": "boolean" }]
  }
  const { indexerDeployerStep, setIndexerDeployerStep } = useContext(AccountContext)
  const [draft, setDraft] = useDraft()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [xnodeData, setXnodeData] = useState<Xnode | undefined>(undefined)
  const [sshKey, setSSHKey] = useState<string>(''); // TODO: Render without "" or [], add a helper description to explain separation by newlines
  
  const id = z.coerce
    .string()
    .parse(String(searchParams.uuid))

  const [user] = useUser()
  const [services, setServices] = useState<ServiceData[]>([])

  const getData = useCallback(async () => {
    setIsLoading(true)

    if (user?.sessionToken) {
      const config = {
        method: 'post' as 'post',
        url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/getXnode`,
        headers: {
          'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
          'X-Parse-Session-Token': user.sessionToken,
          'Content-Type': 'application/json',
        },
        data: {
          "id": id
        }
      }
      try {
        const response = await axios(config);
        console.log("Got response: ", response)

        if (response.data) {
          let node = response.data as Xnode
          node.heartbeatData = JSON.parse(response.data.heartbeatData) as HeartbeatData
          setXnodeData(node)

          if (Array.isArray(JSON.parse(response.data.services))) {
            setServices(JSON.parse(response.data.services))
          } else {
            setServices(JSON.parse(response.data.services)["services"])
            if (JSON.parse(response.data.services)["users.users"]?.length > 0) { // If there's no users.users data then this condition will error.
              console.log("The xnode's userdata:",JSON.parse(response.data.services)["users.users"])
              setSSHKey(JSON.parse(response.data.services)["users.users"][0].options.find(option => option.nixName === "openssh.authorizedKeys.keys").value)
            }
          }
        }
        setIsLoading(false)

      } catch (error) {
        console.log(config);
        toast.error(
          `Error getting the Xnode list: ${error}`
        )
        setIsLoading(false)
      }
    }

  }, [user, id])

  const updateServices = async () => {
    let tempService = JSON.parse(JSON.stringify(services))
    tempService.forEach(service => {
      if (service.nixName != "openssh") {
        let defaultservice = ServiceFromName(service.nixName)
        console.log(service)
        service.options = service.options.filter(option => {
        const defaultOption = defaultservice.options.find(defOption => defOption.name === option.name);

        console.log(defaultOption?.value, option.value)
        return (option.value !== "" && option.value !== "null" && option.value !== null && defaultOption && option.value !== defaultOption.value) || option.type == "boolean"
      });
      }
    });

    if (sshKey != "") {
     tempService.push(opensshconfig)
    }
    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/pushXnodeServices`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
        'X-Parse-Session-Token': user.sessionToken,
        'Content-Type': 'application/json',
      },
      data: {
        "id": id,
        "services": JSON.stringify({ // Should be XnodeConfig object
          "services": tempService,
          "users.users": await sshUserData()
        })
      }
    }
    try {
      const response = await axios(config);
      console.log(response);
      setIsLoading(true);
      getData();
    } catch (error) {
      console.log(config);
      toast.error(`Error updating the Xnode services: ${error}`);
      setIsLoading(false);
    }
  }

  async function sshUserData() {
    const formattedSSHKeys = formatSSHKeys(sshKey)
    return [{
      name: "xnode",
      nixName: "\"xnode\"",
      options: [{
        name: "openssh.authorizedKeys.keys",
        nixName: "openssh.authorizedKeys.keys",
        desc: "ssh key",
        type: "list of string",
        value: `[${formattedSSHKeys}]`

      }]
    }]
  }
  
  function formatSSHKeys(keys: string): string {
    return keys.split('\n').map(key => key.trim()).join(' ');
  }

  useEffect(() => {
    getData()
  }, [user?.sessionToken])

  useEffect(() => {
    console.log(xnodeData)
    if (xnodeData?.heartbeatData) {
      console.log(xnodeData.heartbeatData)
    } else {
      console.log("No heartbeat data. :(")
    }
  }, [xnodeData])

  function timeSince(startDate: Date) {
    let d = new Date(startDate)

    const today = new Date()
    const total = today.getTime() - (d.getTime())

    const minutes = (Math.floor((total / 1000 / 60) % 60))
    const hours = (Math.floor((total / 1000 / 60 / 60) % 24))
    const days = (Math.floor((total / 1000 / 60 / 60 / 24) % 1000000))

    let result = ""
    if (days > 0) {
      result += days

      if (days == 1) {
        result += " day, "
      } else {
        result += " days, "
      }
    }

    if (hours > 0) {
      result += hours

      if (hours == 1) {
        result += " hour, "
      } else {
        result += " hours, "
      }
    }

    result += minutes
    if (minutes == 1) {
      result += " minute"
    } else {
      result += " minutes"
    }

    return result
  }

  function getExpirationDays(startDate: Date) {
    let d = new Date(startDate)
    //console.error(d.getTime())

    const today = new Date()
    const total = today.getTime() - (d.getTime())

    const days = 365 - (Math.floor((total / 1000 / 60 / 60 / 24) % 1000000))

    return days
  }

  function round(x: number) {
    return Math.floor(x * 100) / 100
  }

  return (
    <div className="container">
      <section>
        <div className="content">
          {isLoading && <Loading />}
          {!isLoading && user?.sessionToken ? (
            <>
              {xnodeData ? (
                <div className="xnode-details">
                  <SectionHeader>Your Xnode       {xnodeData.id} </SectionHeader>
                  <p>{xnodeData.name}</p>
                  {xnodeData.isUnit && <p>{getExpirationDays(xnodeData.unitClaimTime) + " Days Left with Machine."}</p>}
                  <div className="box">
                    <p>Last update {timeSince(xnodeData.updatedAt)} ago</p>
                    <div className="measurements">
                      <XnodeMeasurement
                        name="CPU"
                        unit="%"
                        isAvailable={xnodeData.heartbeatData != null}
                        used={round(xnodeData.heartbeatData?.cpuPercent)}
                        available={round(100 - xnodeData.heartbeatData?.cpuPercent)}
                        usedPercent={round(xnodeData.heartbeatData?.cpuPercent)}
                      />
                      <XnodeMeasurement
                        name="RAM"
                        unit="GB"
                        isAvailable={xnodeData.heartbeatData != null}
                        used={round(xnodeData.heartbeatData?.ramMbUsed / 1024)}
                        available={round((xnodeData.heartbeatData?.ramMbTotal - xnodeData.heartbeatData?.ramMbUsed) / 1024)}
                        usedPercent={xnodeData.heartbeatData?.ramMbUsed / xnodeData.heartbeatData?.ramMbTotal * 100}
                      />
                      <XnodeMeasurement
                        name="storage"
                        unit="GB"
                        isAvailable={xnodeData.heartbeatData != null}
                        used={round(xnodeData.heartbeatData?.storageMbUsed / 1024)}
                        available={round((xnodeData.heartbeatData?.storageMbTotal - xnodeData.heartbeatData?.storageMbUsed) / 1024)}
                        usedPercent={xnodeData.heartbeatData?.storageMbUsed / xnodeData.heartbeatData?.storageMbTotal * 100}
                      />
                    </div>
                  </div>
                  <div className="box">
                    <ServiceEditor startingServices={services} updateServices={setServices} />
                  </div>
                  <div className="box">
                    <ServiceAccess startingServices={services} ip={xnodeData.ipAddress} />
                  </div>
                  <div className="box">
                    <p>Actions</p>
                    <Button onClick={() => updateServices()}>Push new services</Button>
                  </div>
                </div>
              ) : (
                <p>No Xnode for that UUID found.</p>
              )}
            </>
          ) : (
            !isLoading && <Signup />
          )}
        </div>
      </section>
    </div>
  );
}

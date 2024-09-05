'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ListTree } from 'lucide-react'
import { useEffect, useState } from 'react'

import { DeploymentConfiguration, ServiceData, type DeploymentTemplate } from '@/types/dataProvider'
import Header from '@/components/ui/header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { convertSize } from "../../utils/functions"

import { useDraft } from '@/hooks/useDraftDeploy'
import ServiceEditor from '@/components/Deployments/serviceEditor'
import EditHeader from '@/components/ui/editableHeader'
type DeploymentTemplateProps = DeploymentTemplate
export default function DeploymentTemplate({
  custom,
  name,
  tags,
  description,
  minSpecs,
  defaultServices,
  isUnit = false,
  nftId = ""
}) {


  const [services, setServices] = useState<ServiceData[]>(defaultServices)
  const [draft, setDraft] = useDraft()
  const [templatename, setTemlatename] = useState<string>(name)


  useEffect(() => {

    let newDraft = {
      name: name,
      desc: description,
      services: services,
      isUnit: isUnit,
      location: "",
      provider: "",
      deploymentAuth: "",
    }

    if (isUnit) {
      newDraft.location = "NYC1"
      newDraft.provider = "Unit"
      newDraft.deploymentAuth = nftId
    }

    setDraft(newDraft as DeploymentConfiguration)
  }, [])

  useEffect(() => {
    if (draft) {
      draft.name = templatename
      console.log("this draft is deployed")
      setDraft(draft)
    }
  }, [templatename])

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ListTree className="size-10 stroke-1 text-primary" />
          <EditHeader level={1} editable={true} input={templatename} State={setTemlatename}></EditHeader>
        </div>
        {custom ? (
          <Link href="/workspace" className="text-primary underline">
            Edit
          </Link>
        ) : null}
      </div>
      {tags ? (
        <p className="mt-6 text-xs text-primary underline">{tags.join(', ')}</p>
      ) : null}
      <p className="mt-4">{description}</p>
      <div className="mt-12 space-y-2">
        <Header level={2}> System requirements </Header>
        <Table>
          <TableHeader className="bg-muted text-muted-foreground">
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Minimum requirements</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>RAM</TableCell>
              <TableCell>{minSpecs?.ram ? `${convertSize(minSpecs.ram)}` : '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Storage</TableCell>
              <TableCell>
                {minSpecs?.storage ? `${convertSize(minSpecs.storage)}` : '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="mt-12 space-y-2">
        {
          draft && (
            <ServiceEditor startingServices={services} updateServices={setServices} />
          )
        }
      </div>
      {/* <div className="mt-12 space-y-2">
        <Header level={2}>Technical Diagram</Header>
        <Image
          src="/images/deploy/diagram.png"
          alt="Technical Diagram"
          width={1200}
          height={600}
          className="w-2/3"
        />
      </div> */}
    </>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ListTree } from 'lucide-react'

import { type DeploymentTemplate } from '@/types/dataProvider'
import Header from '@/components/ui/header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type DeploymentTemplateProps = DeploymentTemplate
export default function DeploymentTemplate({
  custom,
  name,
  tags,
  description,
  minSpecs,
  services,
}: DeploymentTemplateProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ListTree className="size-10 stroke-1 text-primary" />
          <Header level={1}>{name}</Header>
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
        <Header level={2}>System requirements</Header>
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
              <TableCell>{minSpecs?.ram ? `${minSpecs.ram}GB` : '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Storage</TableCell>
              <TableCell>
                {minSpecs?.storage ? `${minSpecs.storage}GB` : '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="mt-12 space-y-2">
        <Header level={2}>Services</Header>
        <Table>
          <TableHeader className="bg-muted text-muted-foreground">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Nix Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services?.map((service, index) => (
              <TableRow key={index}>
                <TableCell>{service.name}</TableCell>
                <TableCell className="max-w-48">
                  {service.description}
                </TableCell>
                <TableCell className="capitalize">
                  {service.tags?.join(', ')}
                </TableCell>
                <TableCell>{service.nixName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

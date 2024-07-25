import { ServiceData, ServiceOption } from "@/types/dataProvider";
import { useEffect, useState } from "react";

import Header from '@/components/ui/header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  ServiceFromName,
} from '@/types/dataProvider'


// TODO:
//  Consider having two arrays, one with the original services and another with the updated services.
//  This would let the user see which services where changed before refreshing their configuration.

const ServiceEditor = ({ startingServices, updateServices }: { startingServices: ServiceData[], updateServices: any }) => {

  const services = startingServices
  const setServices = updateServices

  useEffect(() => {
    let updatedServices = [...services];

    updatedServices.forEach((service, serviceIndex) => {
      
      let tempService = { ...service };
      const defaultService = ServiceFromName(service.nixName);

      if (defaultService) {
        const currentOptionsMap = new Map(tempService.options.map(option => [option.name, option]));


        defaultService.options.forEach(defaultOption => {
          if (!currentOptionsMap.has(defaultOption.name)) {
            tempService.options.push(defaultOption);
          }
        });

        updatedServices[serviceIndex] = tempService;
      }
    });

    setServices(updatedServices);
  }, []);

  const getInputFromOption = (serviceIndex: number, optionIndex: number) => {

    const updateFunc = (newValue: string, serviceIndex: number, optionIndex: number) => {
      let newServices = [...services];

      console.log("Changing to new value: ", newValue)

      newServices[serviceIndex].options[optionIndex].value = newValue;


      setServices(newServices)
    }

    const option = services[serviceIndex].options[optionIndex]

    switch (option.type) {
      case "string":
        return (
          <input type="text" defaultValue={""} placeholder={option.value} onChange={(e) => updateFunc(e.target.value, serviceIndex, optionIndex)} />
        )
      case "boolean":
        return (
          <input type="checkbox" defaultChecked={option.value == "true"} onChange={(e) => updateFunc(e.target.checked.toString(), serviceIndex, optionIndex)} />
        )
      case "int":
        return (
          <input type="number" className="w-12 min-w-fit" defaultValue={null} placeholder={option.value} onChange={(e) => updateFunc(e.target.value.toString(), serviceIndex, optionIndex)} />
        )
      default:
        return (
          <input type="text" defaultValue={""} placeholder={option.value} onChange={(e) => updateFunc(e.target.value, serviceIndex, optionIndex)} />
        )
    }
  }

  return (
    <>
      <Header level={2}> Services </Header>
      <Table>
        <TableHeader className="bg-muted text-muted-foreground">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead> { /* Edit button */ } </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length ? (
            services.map((service, index) => (
              <Dialog key={index}>
                <TableRow>
                  <TableCell>{service.name ? service.name : service.nixName}</TableCell>
                  <TableCell className="max-w-48">
                    {service.desc}
                  </TableCell>
                  <TableCell className="capitalize">
                    {service.tags?.join(', ')}
                  </TableCell>
                  <TableCell>
                    <DialogTrigger className="inline-flex h-10 min-w-24 items-center justify-center whitespace-nowrap rounded-md border border-primary bg-primary/95 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                      Edit
                    </DialogTrigger>
                  </TableCell>
                </TableRow>
                <DialogContent style={{ width: '600px', maxWidth: '600px', maxHeight: '400px', overflowY: 'auto' }}>
                  <DialogHeader>
                    <DialogTitle>{service.name} Options </DialogTitle>
                    <DialogDescription />
                    {service.options?.map((option, optionIndex) => (
                      <div key={optionIndex}>
                        <div className="flex w-full justify-between">
                          <p>{option.name}</p>
                          {getInputFromOption(index, optionIndex)}
                        </div>
                      </div>
                    ))}
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-16 text-center">
                No services available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table >
    </>
  )
}

export default ServiceEditor;

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

const OptionRow = ({ option, serviceIndex, optionIndex, parentUpdateFunc, parentOptionIndex = null }) => {
  const updateFunc = (newValue: string, serviceIndex: number, optionIndex: number, parentOptionIndex: number | null = null) => {
    parentUpdateFunc(newValue, serviceIndex, optionIndex, parentOptionIndex);
  };

  const getInputFromOption = (option, serviceIndex, optionIndex, parentOptionIndex) => {
    const defaultValue = <input type="text" defaultValue={""} placeholder={option.value} onChange={(e) => updateFunc(e.target.value, serviceIndex, optionIndex, parentOptionIndex)} />;

    switch (option.type) {
      case "boolean":
        return (
          <input type="checkbox" defaultChecked={option.value == "true"} onChange={(e) => updateFunc(e.target.checked.toString(), serviceIndex, optionIndex, parentOptionIndex)} />
        );
      case "int":
        return (
          <input type="number" className="w-12 min-w-fit" defaultValue={null} placeholder={option.value} onChange={(e) => updateFunc(e.target.value.toString(), serviceIndex, optionIndex, parentOptionIndex)} />
        );
      case "string":
        if (option.value?.includes(`"`)) {
          let optionValueWithoutQuotes = option.value.replaceAll(`"`, ``); // Quotes are added back in xnode-admin
          return (
            <input type="text" defaultValue={""} placeholder={optionValueWithoutQuotes} onChange={(e) => updateFunc(e.target.value, serviceIndex, optionIndex, parentOptionIndex)} />
          );
        } else {
          return defaultValue;
        }
      default:
        return defaultValue;
    }
  };

  return (
    <>
      <tr>
        <td className="border border-gray-300 px-2 py-1">{option.name ? (option.name) : (option.nixName)}</td>
        <td className="border border-gray-300 px-2 py-1">{option.desc}</td>
        <td className="border border-gray-300 px-2 py-1">
        {option.options?.length > 0 ? "Use suboptions" : getInputFromOption(option, serviceIndex, optionIndex, parentOptionIndex)}
        </td>
      </tr>
      {option.options?.length > 0 && (
        <tr>
          <td colSpan={3}>
            <details>
              <summary>Suboptions for {option.name}</summary>
              <table className="options-table w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 py-1">Option</th>
                    <th className="border border-gray-300 px-2 py-1">Description</th>
                    <th className="border border-gray-300 px-2 py-1">Input</th>
                  </tr>
                </thead>
                <tbody>
                  {option.options.map((suboption: ServiceOption, suboptionIndex: number) => (
                    <OptionRow
                      key={suboptionIndex}
                      option={suboption}
                      serviceIndex={serviceIndex}
                      optionIndex={suboptionIndex}
                      parentOptionIndex={optionIndex}
                      parentUpdateFunc={updateFunc}
                    />
                  ))}
                </tbody>
              </table>
            </details>
          </td>
        </tr>
      )}
    </>
  );
};

const ServiceEditor = ({ startingServices, updateServices }: { startingServices: ServiceData[], updateServices: any }) => {
  const [services, setServices] = useState(startingServices);

  // useEffect(() => {
  //   let updatedServices = [...services];

  //   updatedServices.forEach((service, serviceIndex) => {
  //     let tempService = { ...service };
  //     const defaultService = ServiceFromName(service.nixName);

  //     if (defaultService) {
  //       const currentOptionsMap = new Map(tempService.options.map(option => [option.name, option]));

  //       defaultService.options.forEach(defaultOption => {
  //         if (!currentOptionsMap.has(defaultOption.name)) {
  //           tempService.options.push(defaultOption);
  //         }
  //       });

  //       updatedServices[serviceIndex] = tempService;
  //     }
  //   });

  //   setServices(updatedServices);
  // }, []);

  const updateFunc = (newValue: string, serviceIndex: number, optionIndex: number, parentOptionIndex: number | null = null) => {
    let newServices = [...services];

    if (parentOptionIndex === null) {
      newServices[serviceIndex].options[optionIndex].value = newValue;
    } else if (newServices[serviceIndex].options[parentOptionIndex].options) {
      newServices[serviceIndex].options[parentOptionIndex].options[optionIndex].value = newValue;
    } else {
      console.error("Option not saved")
    }

    setServices(newServices);
  };

  function resetServiceToDefault(serviceNixName: string) {
    for (let i = 0; i < services.length; i++) {
      if(services[i].nixName === serviceNixName) {
        let newServices = services
        newServices[i] = ServiceFromName(serviceNixName)

        setServices(newServices)
        return
      }
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
            <TableHead> { /* Reset button */ } </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length ? (
            services.map((service, index) => (
              <Dialog key={service.nixName}>
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
                  <TableCell>
                    <Button onClick={() => { resetServiceToDefault(service.nixName) } } className="inline-flex h-10 min-w-24 items-center justify-center whitespace-nowrap rounded-md border border-primary bg-primary/95 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                      Reset to default
                    </Button>
                  </TableCell>
                </TableRow>
                <DialogContent style={{ width: '90vw', maxWidth: '100vw', maxHeight: '75vh', overflowY: 'auto' }}>
                  <DialogHeader>
                    <DialogTitle>{service.name} Options </DialogTitle>
                    <DialogDescription />
                    <table className="options-table w-full border-collapse border border-gray-300">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 px-2 py-1">Option</th>
                          <th className="border border-gray-300 px-2 py-1">Description</th>
                          <th className="border border-gray-300 px-2 py-1">Input</th>
                        </tr>
                      </thead>
                      <tbody>
                        {service.options?.map((option, optionIndex) => (
                          <OptionRow
                            key={option.nixName}
                            option={option}
                            serviceIndex={index}
                            optionIndex={optionIndex}
                            parentUpdateFunc={updateFunc}
                          />
                        ))}
                      </tbody>
                    </table>
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
      </Table>
    </>
  );
};

export default ServiceEditor;

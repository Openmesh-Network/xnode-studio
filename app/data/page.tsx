import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { prefix } from '@/utils/prefix'
import { ChevronRightIcon, Cloud, PlusIcon } from 'lucide-react'
import { codeToHtml } from 'shiki'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import Header from '@/components/ui/header'
import { Section } from '@/components/ui/section'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Icons } from '@/components/Icons'

export default function DataOverview() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <Section fullWidth className="mx-auto bg-neutral-50 pt-20">
        <div className="container flex w-full max-w-6xl justify-start gap-x-32">
          <div className="flex max-w-sm flex-col gap-y-6">
            <div className="">
              <Header level={1} className="text-[5rem]">
                OpenAPI
              </Header>
              <p className="text-pretty font-light">
                Power thousands of applications (mobile & web), dAps, protocols,
                DAOs. Built for developers, data scientists, game developers,
                blockchain protocols, and startups.
              </p>
            </div>
            <div className="flex w-full items-center gap-x-4">
              <Button asChild size="xl" className="rounded-sm font-bold">
                <Link href="/data">
                  Explore OpenAPI
                  <ChevronRightIcon className="ml-2 size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outlinePrimary"
                className="rounded-sm"
              >
                <Link href="/data">
                  Learn more
                  <ChevronRightIcon className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
          <Image
            src={`${prefix}/images/data/data-overview-hero.png`}
            alt="OpenAPI hero image"
            width={409}
            height={477}
            className="w-96 rounded-lg"
          />
        </div>
      </Section>
      <Section fullWidth className="bg-[#0C0C0C] py-16 text-white">
        <div className="container max-w-6xl space-y-2">
          <Header level={2} className="text-4xl">
            UnifiedAPI
          </Header>
          <Header level={3} className="text-white">
            Single endpoint for data, APIs, no registration, no licenses.
          </Header>
          <p className="text-balance">
            Power thousands of applications (mobile & web), dAps. protocols,
            DAOs. Built for developers, data scientists, game developers,
            blockchain protocols, and startups.
          </p>
          <CodeCalculator />
        </div>
      </Section>
      <Section
        aria-labelledby="faq-heading"
        className="my-24 space-y-6 text-center"
      >
        <Header level={2} id="faq-heading">
          Frequently Asked Questions
        </Header>
        <Faqs />
      </Section>
    </div>
  )
}

const faqs = [
  {
    question: 'What is OpenAPI and how does it work?',
    answer:
      'OpenAPI is a unified data API that provides a single endpoint for accessing various data sources without the need for registration or licenses. It powers thousands of applications by offering developers, data scientists, game developers, blockchain protocols, and startups easy access to over 345 million data points and 500+ data products.',
  },
  {
    question: 'How can I start using OpenAPI?',
    answer:
      'To start using OpenAPI, you can visit our official website and sign up for an account. Follow the provided documentation and tutorials to learn how to integrate OpenAPI into your projects and access its vast data resources.',
  },
  {
    question: 'What types of data can I access with OpenAPI?',
    answer:
      'With OpenAPI, you can access a wide variety of data including market data, user analytics, blockchain transactions, weather data, and much more. Our comprehensive API allows you to query and retrieve data from multiple sources seamlessly.',
  },
  {
    question: 'Is there any cost associated with using OpenAPI?',
    answer:
      'OpenAPI offers a range of pricing plans, including a free tier that allows you to access a limited amount of data each month. For higher usage and additional features, we offer various subscription plans to suit different needs. Visit our pricing page for more details.',
  },
]

function Faqs() {
  return (
    <div className="mx-auto max-w-5xl">
      <Accordion
        type="single"
        collapsible
        defaultValue="item-0"
        className="space-y-2"
      >
        {faqs.map((faq, index) => (
          <AccordionItem
            className="border-none"
            key={index}
            value={`item-${index}`}
          >
            <AccordionTrigger className="rounded-md bg-accent/70 px-6 text-accent-foreground/80">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-pretty px-12 pt-4 text-left">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export function CodeCalculator() {
  return (
    <div className="flex w-full gap-x-6 py-6">
      <CalculatorSettings />
      <CodeBlock />
      <RightAside />
    </div>
  )
}

const selectData = [
  {
    label: 'Use Case',
    options: [
      'Customer Support',
      'Data Analysis',
      'Marketing Campaign',
      'Fraud Detection',
    ],
  },
  {
    label: 'Data Category',
    options: [
      'Personal Data',
      'Transaction Data',
      'Behavioral Data',
      'Product Data',
    ],
  },
  {
    label: 'Dataset',
    options: [
      'Database',
      'Sales Records',
      'Website Analytics',
      'Product Inventory',
    ],
  },
  {
    label: 'API Output',
    options: ['JSON', 'XML', 'CSV', 'YAML'],
  },
]

function CalculatorSettings() {
  return (
    <div className="flex w-max flex-col items-center space-y-4">
      {selectData.map(({ label, options }, index) => (
        <SelectDemo key={index} label={label} items={options} />
      ))}
      <Button className="w-full">Generate</Button>
    </div>
  )
}

interface SelectDemoProps {
  label: string
  items: string[]
}

const SelectDemo: React.FC<SelectDemoProps> = ({ label, items }) => (
  <Select>
    <SelectTrigger className="dark w-[200px] border-none bg-gray-900 font-bold">
      <SelectValue placeholder={label} />
    </SelectTrigger>
    <SelectContent className="dark text-white">
      <SelectGroup>
        <SelectLabel>{label}</SelectLabel>
        {items.map((item, index) => (
          <SelectItem className="dark" key={index} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
)

async function CodeBlock() {
  const codeString = `import sys
import websockets
import asyncio
import json

# connects to endpoint ENDPOINT
async def main():
    ENDPOINT = 'wss://ws.shared.projectx.network'
    async with websockets.connect(ENDPOINT) as websocket:
        await websocket.send('{"action": "subscribe", "exchange" : 
        "%s", "channel": "%s", "symbol": "%s"}'
         % (sys.argv[1], sys.argv[2], sys.argv[3]))
        async for message in websocket:
            msg = json.loads(message)
            print(json.dumps(msg, indent=4, default=str))
if __name__ == "__main__":
    try: asyncio.run(main())
    except KeyboardInterrupt: print("Exiting...")`

  const html = await codeToHtml(codeString, {
    lang: 'python',
    theme: 'aurora-x',
  })
  return <div className="text-sm" dangerouslySetInnerHTML={{ __html: html }} />
}

function RightAside() {
  return (
    <div className="flex flex-col gap-6">
      <Button className="w-full font-bold" variant="outline" size="xl">
        Data Marketplace
        <ChevronRightIcon className="ml-2 size-5" />
      </Button>
      <Connections />
      <div>
        <Header
          level={4}
          className="text-md mb-1 w-full border-b border-gray-700 pb-1"
        >
          Support Articles
        </Header>
        <Link
          href="/data"
          className="text-balance text-xs text-gray-300 underline"
        >
          Join our community and let us know what you&apos;d like to add!
        </Link>
      </div>
    </div>
  )
}

function Connections() {
  return (
    <div className="">
      <Header
        level={4}
        className="text-md mb-3 w-full border-b border-gray-700 pb-1"
      >
        Dozens of Connections
      </Header>

      <div className="grid grid-cols-4 gap-2">
        <Icons.SnowflakeLogo className="size-7" />
        <Icons.DataBricksLogo className="size-7" />
        <Cloud className="size-7 stroke-2 text-red-600" />
        <Icons.VeridaLogo className="size-7" />
        <Icons.ValidationCloudLogo className="size-7" />
        <Icons.TheGraphLogo className="size-7" />
        <Icons.OpenSeaLogo className="size-7" />
        <Button variant="ghost" size="sm" className="dark p-0 text-sm">
          Add
          <PlusIcon className="ml-1 size-4" />
        </Button>
      </div>
    </div>
  )
}

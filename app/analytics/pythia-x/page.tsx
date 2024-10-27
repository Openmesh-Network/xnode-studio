import Image from 'next/image'
import Link from 'next/link'
import { prefix } from '@/utils/prefix'
import { Search } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import Header from '@/components/ui/header'
import { InfoCard } from '@/components/ui/info-card'
import { Input } from '@/components/ui/input'
import { Section } from '@/components/ui/section'
import { Icons } from '@/components/Icons'

export default function PythiaX() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <Section
        fullWidth
        className="flex flex-col items-center gap-y-4 bg-neutral-50 py-20"
      >
        <Image
          src={`${prefix}/images/analytics/pythia-x/pythia-x-logo.svg`}
          alt="PythiaX logo"
          width={428}
          height={175}
          className="ml-12 h-40"
        />
        <Header level={1} className="text-center text-3xl">
          Introducing Pythia - Your Gateway to Web3 Data
        </Header>
        <p className="text-center text-base">
          Revolutionize your data search and product development with
          Pythia&apos;s cutting-edge platform.
        </p>
        <div className="flex items-center justify-center gap-x-2">
          <div className="relative flex items-center">
            <Search className="absolute right-4 size-4" />
            <Input
              type="text"
              placeholder="Display top play to earn games NFT sales within last 7 days "
              className="min-w-[600px] pl-4 pr-10"
            />
          </div>
          <Button className="h-10 px-6 font-semibold">Go</Button>
        </div>
        <Links />
        <PieChartGraph />
      </Section>
      <Section fullWidth className="bg-white py-16">
        <div className="container">
          <Cards />
        </div>
      </Section>
      <Section
        aria-labelledby="faq-heading"
        className="space-y-6 pb-12 text-center"
      >
        <Header level={2} id="faq-heading">
          Frequently Asked Questions
        </Header>
        <Faqs />
      </Section>
    </div>
  )
}

const cardData = [
  {
    title: 'Data Search',
    description:
      'Pythia’s search function allows you to query and access vast amounts of on-chain and off-chain data seamlessly.',
    icon: Icons.MagnifyingGlassAnalyticsIcon,
  },
  {
    title: 'Development',
    description:
      'Design and build custom data products directly within your wallet, integrating them as ERC20-like assets.',
    icon: Icons.DevelopmentIcon,
  },
  {
    title: 'Query Tool',
    description:
      'Write and execute SQL queries efficiently, accessing a rich dataset to drive insights and innovation.',
    icon: Icons.QueryToolIcon,
  },
  {
    title: 'Customization',
    description:
      'Tailor your products with extensive customization and visual features to meet your needs.',
    icon: Icons.CustomizationIcon,
  },
]

function Cards() {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-4">
      {cardData.map((item, index) => (
        <InfoCard
          key={index}
          title={item.title}
          description={item.description}
          Icon={item.icon}
          className="bg-white"
        />
      ))}
    </div>
  )
}

function Links() {
  return (
    <div className="flex gap-x-8">
      <Link
        className="text-primary hover:text-primary/70 text-sm underline"
        href="/analytics/pythia-x"
      >
        Download Data/Image
      </Link>
      <Link
        className="text-primary hover:text-primary/70 text-sm underline"
        href="/analytics/pythia-x"
      >
        View Query
      </Link>
      <Link
        className="text-primary hover:text-primary/70 text-sm underline"
        href="/analytics/pythia-x"
      >
        Edit Properties
      </Link>
      <Link
        className="text-primary hover:text-primary/70 text-sm underline"
        href="/analytics/pythia-x"
      >
        Run in SQL Lab
      </Link>
    </div>
  )
}

const pieChartData = [
  {
    color: '#4A90E2',
    address: '0xN80jPfN3LkTybpZ4SAVtn6ssIYAyynRa',
    percentage: '50%',
  },
  {
    color: '#A3E3D8',
    address: '0xbNH935dsp7OZqQH1ucYOdleB8cw1aZ',
    percentage: '25%',
  },
  {
    color: '#E59BBE',
    address: '0xN80jPfN3LkTybpZ4SAVtn6ssIYAyynRa',
    percentage: '16.4%',
  },
  {
    color: '#F5B17B',
    address: '0xbNH935dsp7OZqQH1ucYOdleB8cw1aZ',
    percentage: '5.6%',
  },
  {
    color: '#B39FEF',
    address: '0xN80jPfN3LkTybpZ4SAVtn6ssIYAyynRa',
    percentage: '3%',
  },
]

function PieChartGraph() {
  return (
    <div className="mt-12 flex w-full items-center justify-center gap-x-10">
      <Image
        src={`${prefix}/images/analytics/pythia-x/pie-chart.svg`}
        alt="PythiaX logo"
        width={275}
        height={275}
        className="size-48"
      />
      <div className="space-y-1">
        {pieChartData.map((data, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-x-8"
          >
            <div className="flex items-center justify-center gap-1 font-light">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: data.color }}
              />
              <span>{data.address}</span>
            </div>
            <span className="font-bold">{data.percentage}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const faqs = [
  {
    question: 'What is Pythia and how does it work?',
    answer:
      'Pythia is an open-source Web3 data search and product development platform that allows users to search, design, build, and store their own crypto and Web3 data products directly within their wallet. It functions like a decentralized Google, offering instant answers and access to both on-chain and off-chain data through high-performance queries.',
  },
  {
    question: 'How can I get started with Pythia?',
    answer:
      "To get started with Pythia, visit our official website and sign up for an account. Once registered, you can explore our documentation and tutorials to learn how to use Pythia's features and tools.",
  },
  {
    question: 'What types of data can I access with Pythia?',
    answer:
      "Pythia allows access to a wide range of data, including on-chain transaction data, off-chain analytics, market data, and custom datasets created by users. You can query this data using Pythia's intuitive interface or through API integrations.",
  },
  {
    question: 'Is Pythia suitable for beginners?',
    answer:
      'Yes, Pythia is designed to be user-friendly and accessible for beginners. We offer comprehensive guides, support resources, and a community forum to help you get started and make the most of our platform.',
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
            <AccordionTrigger className="bg-accent/70 text-accent-foreground/80 rounded-md px-6">
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

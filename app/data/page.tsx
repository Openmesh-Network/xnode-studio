import Image from 'next/image'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Heading from '@/components/ui/header'
import { Section } from '@/components/ui/section'

export default function DataOverview() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <Section
        fullWidth
        className="flex flex-col items-center gap-y-4 bg-neutral-50 py-20"
      >
        <Image
          src={'/images/analytics/pythia-x/pythia-x-logo.svg'}
          alt="PythiaX logo"
          width={428}
          height={175}
          className="ml-12 h-40"
        />
        <Heading level={1} className="text-center text-3xl">
          Introducing Pythia - Your Gateway to Web3 Data
        </Heading>
      </Section>
      <Section fullWidth className="bg-dark py-16">
        <div className="container"></div>
      </Section>
      <Section
        aria-labelledby="faq-heading"
        className="space-y-6 pb-12 text-center"
      >
        <Heading level={2} id="faq-heading">
          Frequently Asked Questions
        </Heading>
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

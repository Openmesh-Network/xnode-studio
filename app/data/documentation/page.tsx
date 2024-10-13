import { LinkIcon } from 'lucide-react'

import Header from '@/components/ui/header'
import { InfoCard } from '@/components/ui/info-card'
import { Section } from '@/components/ui/section'
import { Icons, type Icon } from '@/components/Icons'

const basicsData = [
  {
    title: 'Understanding Xnode',
    description:
      "An introduction to Xnode's role in decentralizing data infrastructure.",
    Icon: Icons.BoxIcon,
  },
  {
    title: 'Setting Up',
    description: 'Step-by-step guide to deploying an Xnode.',
    Icon: Icons.SettingUpIcon,
  },
  {
    title: 'Docs & Research',
    description: 'Developer support and resources.',
    Icon: Icons.DocsResearchIcon,
  },
]

const coreDocsData = [
  {
    title: 'Dashboard',
    description:
      'Detailed guides and references for all Dashboard related inquiries.',
    Icon: Icons.HomeIcon,
  },
  {
    title: 'Analytics',
    description:
      'Detailed guides and references for all Analytics related inquiries.',
    Icon: Icons.MagnifyingGlassAnalyticsIcon,
  },
  {
    title: 'Integration Guides',
    description:
      'Instructions for integrating Openmesh with other tools and platforms.',
    Icon: LinkIcon as Icon,
  },
  {
    title: 'Servers',
    description:
      'Best practices and protocols to ensure the security of your data and operations.',
    Icon: Icons.ServersIcon,
  },
  {
    title: 'Templates',
    description:
      'Detailed guides and references for all Template related inquiries.',
    Icon: Icons.TemplatesIcon,
  },
  {
    title: 'Troubleshooting',
    description:
      'Comprehensive guides to help you resolve issues and optimize performance.',
    Icon: Icons.TroubleShootingIcon,
  },
]

export default function DataDocumentation() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50">
      <Section fullWidth className="bg-white pb-12 pt-20">
        <div className="container max-w-7xl">
          <Header level={1}>Documentation</Header>
        </div>
      </Section>
      <Section
        aria-labelledby="basics-heading"
        fullWidth
        className="bg-white pb-12"
      >
        <div className="container max-w-7xl space-y-6">
          <Header id="basics-heading" level={2} className="">
            Basics
          </Header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {basicsData.map((item, index) => (
              <InfoCard
                key={index}
                title={item.title}
                description={item.description}
                Icon={item.Icon}
                className="rounded-lg bg-white shadow-sm"
              />
            ))}
          </div>
        </div>
      </Section>
      <Section
        aria-labelledby="core-docs-heading"
        className="mt-12 max-w-7xl space-y-6 pb-12"
      >
        <p className="w-fit rounded-sm bg-primary/10 px-2 py-1.5 text-sm font-semibold text-primary">
          Core Documentation
        </p>
        <Header level={2} id="core-docs-heading" className="">
          Get to know individual modules
        </Header>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {coreDocsData.map((item, index) => (
            <InfoCard
              key={index}
              title={item.title}
              description={item.description}
              Icon={item.Icon}
              className="rounded-lg bg-white shadow-sm"
            />
          ))}
        </div>
      </Section>
    </div>
  )
}

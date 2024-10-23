'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { prefix } from '@/utils/prefix'
import { LineChart, MoveRight, PackageOpen, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { useDemoModeContext } from '@/components/demo-mode'

const exploreItems = [
  {
    image: (
      <Image
        alt=""
        src={`${prefix}/images/xnode-card/silvercard-front.webp`}
        width={60}
        height={60}
      />
    ),
    title: 'Redeem an Xnode Virtual Machine with a Pin',
    description:
      'Xnode DVM (Decentralized Virtual Machine) is a sophisticated infrastructure deployment system that provides NFT-controlled access to computing resources.',
    callToAction: 'Redeem (~1m)',
    href: '/claim',
  },
  {
    image: <PackageOpen width={60} height={60} />,
    title: 'Deploy Your First App',
    description:
      'Pick an app from the Openmesh App Store and experience how easy it is to add new apps to your Xnode.',
    callToAction: 'Browse (~2m)',
    href: '/app-store',
  },
  {
    image: <Star width={60} height={60} />,
    title: 'Claim Contribution Rewards',
    description:
      'On your Xnode you are encouraged to run Openmesh Core. This will allocate a small amount of your resources to help the Openmesh Network. Contributors are able to claim OPEN tokens periodically.',
    callToAction: 'Claim (~1m)',
    href: '/rewards',
  },
  {
    image: <LineChart width={60} height={60} />,
    title: 'Node Operators Economic Viability Calculator',
    description:
      'Compare how much profit you would earn by running a blockchain node on a certain providers.',
    callToAction: 'Compare',
    href: 'https://www.openmesh.network/naas',
  },
]

export default function Explore() {
  const { push } = useRouter()
  const { setDemoMode } = useDemoModeContext()

  const navigate = (to: string) => {
    if (to.startsWith('/')) {
      setDemoMode(true)
    }
    push(to)
  }

  return (
    <section className="container mx-0 mt-12 flex w-full flex-col px-5">
      <span className="text-3xl font-bold">
        Test Power of Xnode & Openmesh Innovations
      </span>
      <div className="mt-12 flex w-full flex-wrap">
        {exploreItems.map((item, i) => (
          <div className="flex basis-1/3 flex-col">
            <Card
              key={i}
              className="mb-8 mr-8 flex grow flex-col border border-gray-300 px-6 py-10"
            >
              <div className="flex gap-3">
                <div className="shrink-0 grow-0">{item.image}</div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </div>
              <CardDescription className="mb-10 mr-10 mt-4 grow">
                {item.description}
              </CardDescription>
              <div>
                <Button
                  className="flex gap-3 py-6"
                  onClick={() => navigate(item.href)}
                >
                  {item.callToAction} <MoveRight />
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  )
}

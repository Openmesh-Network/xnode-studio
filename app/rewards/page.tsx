import React from 'react'
import { AlertTriangle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Header from '@/components/ui/header'
import { Section } from '@/components/ui/section'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Icons } from '@/components/Icons'
import RewardsChart from '@/app/rewards/chart'
import { ClaimCard } from '@/app/rewards/claim-card'

export default function RewardsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <Section className="flex justify-between pt-20">
        <div className="space-y-8">
          <Header level={1}>Rewards</Header>
          <Alert className="bg-yellow/70 hover:bg-yellow/80">
            <AlertTriangle className="size-5" />
            <AlertTitle>Showcase</AlertTitle>
            <AlertDescription>
              This page contains mock information for demo purposes.
            </AlertDescription>
          </Alert>
          <div className="flex w-fit items-center justify-center gap-x-4">
            <Card className="w-fit p-2">
              <Icons.BoxIcon className="size-10" />
            </Card>
            <div>
              <p className="font-bold">Validator Node #2534</p>
              <p className="font-light">Activated 12 min ago</p>
            </div>
          </div>
          <p className="max-w-3xl text-pretty text-xs text-gray-500">
            Congratulations! Your validator node is now active, marking a
            significant step towards empowering the Openmesh Network. You have
            become a committed member of a pioneering community dedicated to
            maintaining a worldwide open data network and securely storing
            important global data without the need for a middleman. We thank you
            for supporting our mission to democratize data and address
            information asymmetry.
          </p>
        </div>
        <ClaimCard />
      </Section>
      <Section className="mt-20">
        <Header level={2} className="mb-4 text-xl">
          Your rewards
        </Header>
        <div className="-ml-14">
          <RewardsChart />
        </div>
      </Section>
      <Section className="mt-20">
        <Header level={2} className="mb-4 text-xl">
          Your node activities
        </Header>
        <NodeActivityTable />
      </Section>
      <Section className="mt-20">
        <Stats />
      </Section>
      <Section className="py-20">
        <Header level={2} className="mb-4 text-xl">
          Active validators
        </Header>
        <ActiveValidatorTable />
      </Section>
    </div>
  )
}

const tableColumns = [
  'Reward ID',
  'Wallet',
  'Date of claim',
  'Amount',
  'Status tx',
  'Actions',
]

export const rewardsMockData = [
  {
    rewardId: '8267353',
    wallet: '0x73554...4745',
    dateOfClaim: '12:00:00 UTC, Nov 17, 2023',
    amount: '725 OPEN',
    statusTx: '4 Days left to claim',
    action: 'Claim',
    node: 'EVP 001',
  },
  {
    rewardId: '8267354',
    wallet: '0x73554...4745',
    dateOfClaim: '12:00:00 UTC, Nov 10, 2023',
    amount: '725 OPEN',
    statusTx: '0x83735...244',
    action: 'You claimed',
    node: 'EVP 002',
  },
  {
    rewardId: '8267355',
    wallet: '0x73554...4745',
    dateOfClaim: '12:00:00 UTC, Nov 3, 2023',
    amount: '725 OPEN',
    statusTx: '0x83735...244',
    action: 'You claimed',
    node: 'EVP 012',
  },
]

function NodeActivityTable() {
  return (
    <Table>
      <TableHeader className="">
        <TableRow className="text-left text-base">
          {tableColumns.map((column, index) => (
            <TableHead
              className={cn('text-card-foreground font-normal')}
              key={index}
            >
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rewardsMockData.map((item, index) => (
          <TableRow
            key={index}
            className="h-14 border-none text-sm odd:rounded-lg"
          >
            <TableCell>{item.rewardId}</TableCell>
            <TableCell className="flex h-12 items-center space-x-2">
              {item.wallet}
            </TableCell>
            <TableCell>{item.dateOfClaim}</TableCell>
            <TableCell>{item.amount}</TableCell>
            <TableCell>{item.statusTx}</TableCell>
            <TableCell className="w-32">
              {item.action === 'Claim' ? (
                <Button className="w-full px-4 py-2 text-white">Claim</Button>
              ) : (
                <Button
                  disabled
                  className="w-full bg-gray-900 px-4 py-2 text-white"
                >
                  {item.action}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function Stats() {
  const statsData = [
    { label: 'Total Validators', value: '84' },
    { label: 'Total Stake amount', value: '372,994' },
    { label: 'Average rewards', value: '12.56%' },
    { label: 'Average payout period', value: 'Every 7 days' },
  ]

  return (
    <div className="flex justify-between">
      {statsData.map((stat, index) => (
        <div key={index} className="space-y-1 text-left">
          <div className="text-sm text-gray-600">{stat.label}</div>
          <div className="text-2xl font-semibold text-black">{stat.value}</div>
        </div>
      ))}
    </div>
  )
}

const validatorTableData = [
  {
    validatorId: '8267353',
    publicAddress: '0x73554...4745',
    dateOfCreation: '133 days ago, Nov 17, 2023',
    location: 'Austin, USA',
    stakedAmount: '52,000 OPEN',
    earnedRewards: '252,003 OPEN',
    status: 'active',
  },
  {
    validatorId: '8267353',
    publicAddress: '0x73554...4745',
    dateOfCreation: '133 days ago, Nov 17, 2023',
    location: 'Sydney, Australia',
    stakedAmount: '32,000 OPEN',
    earnedRewards: '252,003 OPEN',
    status: 'active',
  },
  {
    validatorId: '8267353',
    publicAddress: '0x73554...4745',
    dateOfCreation: '133 days ago, Nov 17, 2023',
    location: 'Sydney, Australia',
    stakedAmount: '13,000 OPEN',
    earnedRewards: '252,003 OPEN',
    status: 'active',
  },
  {
    validatorId: '8267353',
    publicAddress: '0x73554...4745',
    dateOfCreation: '133 days ago, Nov 17, 2023',
    location: 'Sydney, Australia',
    stakedAmount: '32,000 OPEN',
    earnedRewards: '252,003 OPEN',
    status: 'active',
  },
  {
    validatorId: '8267353',
    publicAddress: '0x73554...4745',
    dateOfCreation: '133 days ago, Nov 17, 2023',
    location: 'Sydney, Australia',
    stakedAmount: '13,000 OPEN',
    earnedRewards: '252,003 OPEN',
    status: 'active',
  },
]

const validatorTableColumns = [
  'Validator ID',
  'Validator public address',
  'Date of creation',
  'Location',
  'Staked amount',
  'Earned rewards',
  'Status',
]

function ActiveValidatorTable() {
  return (
    <Table>
      <TableHeader className="">
        <TableRow className="text-left">
          {validatorTableColumns.map((column, index) => (
            <TableHead
              className={cn(
                index == validatorTableColumns.length - 1 && 'text-center',
                'text-card-foreground font-normal'
              )}
              key={index}
            >
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {validatorTableData.map((item, index) => (
          <TableRow key={index} className="h-14 border-none odd:rounded-lg">
            <TableCell>{item.validatorId}</TableCell>
            <TableCell className="flex h-14 items-center space-x-2">
              {item.publicAddress}
            </TableCell>
            <TableCell>{item.dateOfCreation}</TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.stakedAmount}</TableCell>
            <TableCell>{item.earnedRewards}</TableCell>
            <TableCell className="text-center">
              <span className="inline-block size-3 animate-pulse rounded-full bg-green-500"></span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

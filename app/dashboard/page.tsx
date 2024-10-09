import { cookies } from 'next/headers'
import { format } from 'date-fns'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { rewardsMockData } from '../rewards/page'
import { HealthSummary, XNodesApps, XNodesHealth } from './health-data'

export default async function DashboardPage() {
  const { value: sessionToken } = cookies().get('userSessionToken')

  return (
    <div className="container my-12 max-w-none">
      <section className="space-y-4 rounded border p-6">
        <h2 className="text-xl font-bold">Resources</h2>
        <HealthSummary sessionToken={sessionToken} />
      </section>
      <section className="mt-6 space-y-4 rounded border p-6">
        <h2 className="text-xl font-bold">Individual Nodes</h2>
        <XNodesHealth sessionToken={sessionToken} />
      </section>
      <div className="mt-6 grid grid-cols-2 gap-6">
        <section className="space-y-4 rounded border p-6">
          <h2 className="text-xl font-bold">Rewards</h2>
          {/* eslint-disable-next-line tailwindcss/migration-from-tailwind-2 */}
          <Table className="w-full overflow-clip rounded">
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="h-7">Node</TableHead>
                <TableHead className="h-7">Date of Claim</TableHead>
                <TableHead className="h-7">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewardsMockData.map((reward) => (
                <TableRow key={`reward-${reward.dateOfClaim}`}>
                  <TableCell>{reward.node}</TableCell>
                  <TableCell>
                    {format(reward.dateOfClaim, 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{reward.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
        <section className="space-y-4 rounded border p-6">
          <h2 className="text-xl font-bold">Running Apps</h2>
          <XNodesApps sessionToken={sessionToken} />
        </section>
      </div>
      {/* <Dashboard /> */}
    </div>
  )
}

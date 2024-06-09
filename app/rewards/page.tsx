import { Card } from '@/components/ui/card'
import Header from '@/components/ui/header'
import { Section } from '@/components/ui/section'
import { Icons } from '@/components/Icons'
import RewardsChart from '@/app/rewards/chart'
import { ClaimCard } from '@/app/rewards/claim-card'

export default function RewardsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <Section className="flex justify-between pt-20">
        <div className="space-y-8">
          <Header level={1}>Rewards</Header>
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
    </div>
  )
}

function NodeActivityTable() {}

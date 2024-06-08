import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/ui/header'
import { InfoCard } from '@/components/ui/info-card'
import { Section } from '@/components/ui/section'

export default function ComputDeploy() {
  return (
    <Section className="flex gap-x-2 py-20">
      <div className="">
        <Header level={1} className="text-3xl">
          Compute
        </Header>
        <div className="grid grid-cols-3 gap-8"></div>
      </div>
      <Card className="">
        <CardHeader>
          <CardTitle>Monthly Estimate</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </Section>
  )
}

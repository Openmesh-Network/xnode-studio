import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function ClaimCard() {
  return (
    <Card className="max-w-[280px] p-2">
      <CardHeader className="space-y-4">
        <div className="px-6">
          <Input defaultValue={0} className="text-center text-xl" />
        </div>
        <p className="text-center text-sm">Your validator rewards</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-sm">
          <p className="font-semibold text-green-500 underline">address</p>
          <p>Success! Your wallet has a valid Validator Pass</p>
        </div>
        <Button size="xl" className="w-full">
          Stake
        </Button>
      </CardContent>
    </Card>
  )
}

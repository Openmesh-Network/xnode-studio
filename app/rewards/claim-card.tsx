import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function ClaimCard() {
  return (
    <Card className="max-w-[250px] p-2 px-3">
      <CardHeader className="space-y-4">
        <div className="px-2">
          <Input defaultValue={0} className="text-center text-xl" />
        </div>
        <p className="text-center text-sm">Your validator rewards</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2 text-center text-sm">
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

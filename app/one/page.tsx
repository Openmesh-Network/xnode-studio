import Image from 'next/image'
import Back from '@/public/images/xnode-one/back.png'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function XnodeOnePage() {
  return (
    <div className="pt-10">
      <div className="flex">
        <div className="flex grow flex-col gap-2 pl-10">
          <span className="text-4xl font-semibold">Xnode One</span>
          <span className="max-w-[1000px] text-lg text-muted-foreground">
            Owning the physical hardware is the most trustless way to run your
            Xnode applications. It allows you to have a one time purchase
            instead of paying reoccurring cloud renting costs. It also helps
            improve the network decentralization!
          </span>
        </div>
        <div className="pr-5">
          <Image src={Back} alt="Back of Xnode One" width={272} height={600} />
        </div>
      </div>
      <div className="flex flex-col gap-5 p-5">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Acquire</CardTitle>
            <CardDescription>
              Order an Xnode One from Openmesh or one of its verified resellers
              and wait for it to be delivered.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Power</CardTitle>
            <CardDescription>
              Unbox your package and connect the Xnode One to the power grind
              with the included power cable. The power connector is located at
              the back of the device (opposite to the power button) on the
              bottom row.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Connect</CardTitle>
            <CardDescription>
              Plug in an Ethernet cable or connect over WiFi. The Ethernet
              connector can be found on the top right of the back of the device.
              WiFi can be configured after powering the device by connecting to
              its configuration WiFi network (SSID: Xnode One, password:
              OpenmeshNetwork) and following the instructions. This
              configuration WiFi network will not be visible if the Xnode One
              has internet access.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Setup</CardTitle>
            <CardDescription>
              After performing all above steps, your Xnode One should show up in
              the list bellow. Make sure this device, used to access Xnode
              Studio, is on the same network as your Xnode One. In case the
              Xnode One is not shown after several minutes, try pushing the
              reset button on the device (this will restore it to factory
              settings, all data on the device is lost). In case you are still
              experiencing issues, please contact engineering@openmesh.network.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex place-items-center gap-5">
              <div className="size-8 animate-spin rounded-full border-b-2 border-primary" />
              <span>Searching for Xnode devices on the local network</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

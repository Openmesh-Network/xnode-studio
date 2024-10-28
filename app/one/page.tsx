import Image from 'next/image'
import Back from '@/public/images/xnode-one/back.png'

export default function XnodeOnePage() {
  return (
    <div className="flex place-content-center pt-10">
      <span className="grow pl-10 text-4xl font-semibold">Xnode One</span>
      <div>
        <Image src={Back} alt="Back of Xnode One" width={272} height={600} />
      </div>
    </div>
  )
}

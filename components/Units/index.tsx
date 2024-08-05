'use client'

import Image from 'next/image'
import cardBackImage from '@/assets/silvercard-back.svg'
import cardFrontImage from '@/assets/silvercard-front.svg'

import Claim from './Claim'

const Units = ({ chainId }: { chainId: number }) => {
  return (
    <section className="m-auto flex size-full justify-around p-20">
      <div className="flex h-full w-fit flex-col">
        <Image
          className="flex-item m-0 select-none"
          src={cardFrontImage}
          alt="Xnode reedeem card front"
        />

        <Image
          className="flex-item m-0 select-none"
          src={cardBackImage}
          alt="Xnode reedeem card back"
        />
      </div>
      <div className="h-full w-3/4 max-w-[600px] text-black">
        {/* Do first step */}
        {/* Do second step */}
        {/* Do third step */}

        <Claim chainId={chainId} />
      </div>
    </section>
  )
}

export default Units

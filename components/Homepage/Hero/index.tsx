import Image from 'next/image'

import heroImage from '@/assets/homeHero.svg'
import Link from 'next/link'

export function HomeHero() {
  return (
    <section className="relative w-full">
      <div className="ml-0 flex max-w-[725px] flex-col items-start gap-y-12 p-8 lg:ml-24 lg:pt-32">
        <h1 className="text-left text-[5.5rem] font-bold leading-[80px] text-black">
          Accelerate Your Infrastructure Development.
        </h1>
        <p className="max-w-[550px] text-base font-medium text-darkGray">
          Unleash the Power of Xnode: Your Gateway to Building Personalized Data
          Ecosystems in minutes, instead of weeks.
        </p>
        <Link
          href={`${
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
              ? `/xnode/template-products`
              : `/template-products`
          }`}
        >
          <button className="h-14 w-[190px] rounded-md bg-blue500 px-5 font-bold tracking-[-2%] text-white transition-colors duration-300 hover:bg-blue500/80">
            Try for free
          </button>
        </Link>
      </div>
      <Image
        className="absolute right-0 top-0 -z-10 hidden select-none lg:block"
        src={heroImage}
        alt="Rectangles background"
      />
    </section>
  )
}

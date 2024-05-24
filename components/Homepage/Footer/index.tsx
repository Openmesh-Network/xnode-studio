import Link from 'next/link'

/* eslint-disable react/no-unescaped-entities */
const Footer = () => {
  const useCasesOptions = [
    'Financial Analysis',
    'Blockchain Transactions',
    'DEXs and CEXs',
    'Gas Optimization',
    'Crypto Liquidity',
  ]
  return (
    <section className="mt-16 lg:mt-32">
      <div className="flex flex-col items-start justify-center gap-y-10 bg-gray100 px-4 py-8 lg:justify-between lg:px-24 lg:py-20 2xl:flex-row">
        <div className="w-full max-w-[615px]">
          <div className="text-[16px] font-bold text-black md:text-[19.2px] lg:text-[22.5px] lg:!leading-[39px] xl:text-[25.5px] 2xl:text-[32px]">
            Openmesh
          </div>
          <div className="mt-[10px] text-xs font-normal text-black md:text-[14.5px] lg:mt-4 lg:text-2xl">
            Building open-source decentralized data infrastructure in Web2 and
            Web3 data
          </div>
          <div className="mt-4 text-xs text-black lg:mt-24 lg:text-base">
            Openmesh, 2024
          </div>
        </div>

        <div className="flex flex-col items-start gap-20 lg:flex-row">
          <div className="flex flex-col items-start gap-y-4">
            <strong className="text-base font-bold text-black">
              Use Cases
            </strong>
            <ul className="flex flex-col gap-y-2">
              {useCasesOptions.map((useCase, index) => (
                <li key={useCase}>
                  <Link
                    href={'https://www.openmesh.network/xnode/data-products'}
                    key={index}
                  >
                    <div
                      key={index}
                      className={`cursor-pointer text-black hover:text-[#757575]`}
                    >
                      {useCase}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-y-4">
            <div className="flex flex-col gap-y-3">
              <strong className="text-base font-bold text-black">
                Suggest a new feature
              </strong>
              <Link
                href={'https://www.openmesh.network/oec/register'}
                target="_blank"
                className="font-medium text-[#0354EC] underline decoration-blue500"
                rel="noreferrer"
              >
                Join our community and let us know what you’d like to add!
              </Link>
            </div>
            <div className="flex flex-col gap-y-3">
              <strong className="text-base font-bold text-black">
                Have more questions?
              </strong>
              <Link
                href={'https://calendly.com/openmesh/30min'}
                target="_blank"
                className="font-medium text-[#0354EC] underline decoration-blue500"
                rel="noreferrer"
              >
                Schedule a call with an Openmesh Expert
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Footer

export function HomeAdvantages() {
  const possibilities = [
    {
      title: 'Blockchain and Smart Contracts',
      description: 'Democratizing Data: Free Immutable Data to the World',
    },
    {
      title: 'Many Integrations. Endless Possibilities',
      description: "Xnode's modularized design and SDKs",
    },
  ]

  const advantages = [
    {
      title: 'Speed to production',
      fill: 'absolute h-[6px] rounded-[8px] bg-blue500 w-[83%]',
      pos: 'absolute top-1/2 h-[16px] w-[16px] -translate-x-[8px] -translate-y-1/2 rounded-full bg-blue500 left-[83%]',
    },
    {
      title: 'Ongoing cost',
      fill: 'absolute h-[6px] rounded-[8px] bg-blue500 w-[13%]',
      pos: 'absolute top-1/2 h-[16px] w-[16px] -translate-x-[8px] -translate-y-1/2 rounded-full bg-blue500 left-[13%]',
    },
  ]

  return (
    <section className="mt-16 w-full px-4 lg:mt-36 lg:px-24">
      <div className="flex w-full flex-wrap justify-center gap-y-12 lg:justify-between">
        <div className="flex flex-col">
          <div className="text-[1.75rem] font-bold leading-tight text-black lg:leading-[180%]">
            Data Cloud Management{' '}
          </div>
          <div className="mt-[6px] w-full max-w-[479px] text-[14px] leading-[20px] text-darkGray">
            Create your infrastructure quickly with our drag-and-drop design
            framework. Instead of spending weeks coding and integrating services
            and applications, you can now build your infrastructure in the
            region of your choice, with the workloads and applications you need,
            all in just minutes.
          </div>
          <div className="mt-8 flex flex-col gap-y-5 lg:mt-16">
            {advantages.map(({ title, pos, fill }) => {
              return (
                <div key={title}>
                  <h3 className="text-lg font-semibold -tracking-[3%] text-black">
                    {title}
                  </h3>
                  <div className="relative mt-2 h-[6px] max-w-[479px] rounded-[8px] bg-gray200">
                    <div className={fill} />
                    <div className={pos} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex w-full max-w-[620px] flex-col">
          <div className="text-[28px] font-bold leading-tight text-[#000] lg:leading-[180%]">
            Explore Possibilities{' '}
          </div>
          <div className="mt-[6px] w-full  text-sm leading-[20px] text-darkGray">
            Our modularized design allows you to quickly design, combine, and
            provision web2 and web3 infrastructure products. This includes
            connecting to data feeds, building APIs, linking to blockchains (RPC
            nodes), and accessing compute, storage, databases, analytics, and
            developer tools. Deploy in seconds and only pay for compute and
            storage, saving thousands.
          </div>
          <div className="mt-8 flex w-full flex-col justify-start gap-y-8 lg:mt-20 lg:flex-row lg:justify-between lg:gap-0">
            {possibilities.map(({ description, title }) => {
              return (
                <div
                  className="flex w-full max-w-[280px] items-start gap-x-[28px]"
                  key={title}
                >
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/template/cube.svg`}
                    alt="image"
                  />
                  <div>
                    <div className="text-lg font-semibold leading-[22px] text-black">
                      {title}
                    </div>
                    <div className="mt-[3px] text-xs font-light leading-[20px] text-darkGray">
                      {description}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

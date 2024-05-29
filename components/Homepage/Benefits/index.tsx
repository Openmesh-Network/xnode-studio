export function HomeBenefits() {
  const benefits = [
    {
      highlight: '27X',
      title: 'Faster Development',
      description:
        'Accelerate both development and deployment, pushing your projects to completion quicker than ever.',
    },
    {
      highlight: '6X',
      title: 'Reduction Cost',
      description:
        'Dramatically cut costs without hidden fees, making efficiency affordable.',
    },
    {
      highlight: '5X',
      title: 'Expanded Access',
      description:
        'Broaden your horizons with extensive access to external data.',
    },
    {
      highlight: '8X',
      title: 'Enhanced Composability',
      description:
        'Seamlessly integrate and customize with other systems, simplifying complexity.',
    },
  ]

  return (
    <section className="mt-16 flex w-full flex-col items-center gap-y-6 px-4 lg:mt-[190px] lg:gap-y-16 lg:px-24">
      <h2 className="text-center text-[1.5rem] font-bold text-black lg:text-[2rem]">
        Maximize Efficiency & Savings
      </h2>
      <ul className="flex w-full flex-wrap items-center justify-center gap-y-8 lg:justify-between">
        {benefits.map(({ description, highlight, title }) => {
          return (
            <li
              className="flex w-full max-w-[236px] flex-col items-center gap-y-2"
              key={title}
            >
              <div className="text-[1.75rem] font-bold leading-none text-blue500">
                {highlight}
              </div>
              <div className="text-center text-lg font-bold text-black">
                {title}
              </div>
              <div className="text-center text-sm text-darkGray">
                {description}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

interface dataSourceType {
  title: string
  list: string[]
}

interface ModalProps {
  service: string
  cloud: string
  region: string
  latency: string
  database: string
  dataSources: dataSourceType[]
  addOns: string[]
  serversNumber: Number
  serverType: string
  cost: Number
}

const CostEstimator = ({ ...data }: ModalProps) => {
  return (
    <>
      <div className="sticky top-8 mt-[18px] bg-white px-[12.5px] py-[10px] text-[7px] text-black shadow-[0_8px_15px_0px_rgba(0,0,0,0.20)] md:mt-[21px] md:px-[15px] md:py-[12px] md:text-[8.5px] lg:mt-[24px] lg:px-[17.5px] lg:py-[14px] lg:text-[10px] lg:!leading-[17px] xl:px-[20px] xl:py-[16px] xl:text-[11.2px] 2xl:mt-[35px] 2xl:px-[25px] 2xl:py-[20px] 2xl:text-[14px]">
        <div className="text-[8px] font-bold md:text-[9px] lg:text-[11px] lg:!leading-[19px] xl:text-[13px] 2xl:text-[16px]">
          Service summary
        </div>
        <div className="mt-[10px] font-medium text-[#959595] md:mt-[12px] lg:mt-[14px] 2xl:mt-[20px]">
          <div className="border-b border-[#D4D4D4] pb-[5px]">
            <div>Service</div>
            <div className="mt-[5px] font-bold text-[#505050]">
              {data.service}
            </div>
          </div>
          <div className="mt-[5px] border-b border-[#D4D4D4] pb-[5px] md:mt-[6px] lg:mt-[7px] 2xl:mt-[10px]">
            <div>Cloud</div>
            <div className="mt-[5px] font-bold text-[#505050]">
              {data.cloud}
            </div>
          </div>
          <div className="mt-[5px] border-b border-[#D4D4D4] pb-[5px] md:mt-[6px] lg:mt-[7px] 2xl:mt-[10px]">
            <div>Region</div>
            <div className="mt-[5px] font-bold text-[#505050]">
              {data.region}
            </div>
          </div>
          <div className="mt-[5px] border-b border-[#D4D4D4] pb-[5px] md:mt-[6px] lg:mt-[7px] 2xl:mt-[10px]">
            <div>Latency</div>
            <div className="mt-[5px] font-bold text-[#505050]">
              {data.latency}
            </div>
          </div>
          <div className="mt-[5px] border-b border-[#D4D4D4] pb-[5px] md:mt-[6px] lg:mt-[7px] 2xl:mt-[10px]">
            <div>Database</div>
            <div className="mt-[5px] font-bold text-[#505050]">
              {data.database}
            </div>
          </div>
          <div className="mt-[5px] border-b border-[#D4D4D4] pb-[5px] md:mt-[6px] lg:mt-[7px] 2xl:mt-[10px]">
            <div>Data sources</div>
            <div className="mt-[5px] grid gap-y-[5px] font-bold text-[#505050]">
              {data.dataSources.map((dataSource, index) => (
                <>
                  <div className="font-bold">{dataSource.title}</div>
                  <ul key={index} className="list-disc pl-[25px] font-medium">
                    {dataSource.list.map((option, index) => (
                      <li key={index}>{option}</li>
                    ))}
                  </ul>
                </>
              ))}
            </div>
          </div>
          <div className="mt-[5px] border-b border-[#D4D4D4] pb-[5px] md:mt-[6px] lg:mt-[7px] 2xl:mt-[10px]">
            <div>Add-ons</div>
            <div className="mt-[5px] font-bold text-[#505050]">
              <ul className="grid gap-y-[2px]">
                {data.addOns.map((dataSource, index) => (
                  <>
                    <li key={index}>{dataSource}</li>
                  </>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-[10px] text-[8px] md:mt-[12px] md:text-[9px] lg:mt-[14px] lg:text-[11px] lg:!leading-[19px] xl:text-[13px] 2xl:mt-[20px] 2xl:text-[16px]">
          <div className="font-medium">No. of servers</div>
          <div className="mt-[5px] font-bold">
            {String(data.serversNumber)} x {data.serverType} servers
          </div>
        </div>
        <div className="mt-[10px] text-[8px] md:mt-[12px] md:text-[9px] lg:mt-[14px] lg:text-[11px] lg:!leading-[19px] xl:text-[13px] 2xl:mt-[20px] 2xl:text-[16px]">
          <div className="font-medium">Estimated monthly price*</div>
          <div className="mt-[5px] font-bold">{String(data.cost)} / month</div>
        </div>
        <div className="mt-[10px] grid gap-y-[8px] text-[7px] font-medium md:mt-[12px] md:gap-y-[9px] md:text-[8.4px] lg:mt-[14px] lg:gap-y-[10.5px] lg:text-[10px] lg:!leading-[17px] xl:text-[11.2px] 2xl:mt-[20px] 2xl:gap-y-[15px] 2xl:text-[14px]">
          <div className="flex w-full cursor-pointer items-center justify-center gap-x-[5px] rounded-[5px] border border-[#959595] p-[5px] py-[7px] text-center text-[#959595] hover:bg-[#f1f1f1] md:gap-x-[6px] md:py-[7.5px] lg:gap-x-[7px] lg:py-[8.75px] xl:gap-x-[8px] xl:py-[9.6px] 2xl:gap-x-[10px] 2xl:py-[12.5px]">
            <img
              src={`${
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                  ? process.env.NEXT_PUBLIC_BASE_PATH
                  : ''
              }/images/costEstimator/arrow.svg`}
              alt="image"
              className="h-[6px] w-[8px] md:h-[6.6px] md:w-[9.3px] lg:h-[7.7px] lg:w-[10.85px] xl:h-[8.8px] xl:w-[12.4px] 2xl:h-[11px] 2xl:w-[15.5px]"
            />
            <div>Download Estimate as PDF</div>
          </div>
          <div className="flex w-full cursor-pointer items-center justify-center gap-x-[5px] rounded-[5px] bg-[#0354EC] p-[5px] py-[7px] text-center text-white hover:bg-[#123981] md:gap-x-[6px] md:py-[7.5px] lg:gap-x-[7px] lg:py-[8.75px] xl:gap-x-[8px] xl:py-[9.6px] 2xl:gap-x-[10px] 2xl:py-[12.5px]">
            <img
              src={`${
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                  ? process.env.NEXT_PUBLIC_BASE_PATH
                  : ''
              }/images/costEstimator/lightning.svg`}
              alt="image"
              className="h-[8px] w-[5px] md:h-[9.6px] md:w-[6px] lg:h-[11.2px] lg:w-[7px] xl:h-[12.8px] xl:w-[8px] 2xl:h-[16px] 2xl:w-[10px]"
            />
            <div>Create service and deploy</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CostEstimator

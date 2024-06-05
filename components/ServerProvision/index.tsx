interface ModalProps {
  serversNumber: number
  serverType: string
  onChangeServerNumber(number): void
  onChangeServerType(string): void
}

const ServerProvision = ({ ...data }: ModalProps) => {
  const numberOfServersOptions = [1, 2, 3, 4, 5, 6]

  return (
    <>
      <div className="rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[12px] 2xl:px-[20px] 2xl:py-[15px]">
        <div className="relative flex items-center gap-x-[10px]">
          <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
            4. Usecase
          </div>
        </div>
        <div
          className={`mt-[12px] w-fit rounded-[5px] bg-[#fff] p-[10px] md:p-[12px] lg:mt-[17.5px] lg:p-[14px] xl:p-[16px] 2xl:mt-[25px] 2xl:p-[20px]`}
        >
          <div className="">
            <div className="w-full max-w-[250px]">
              <div className="text-[9px] font-bold text-[#313131] md:text-[11px] lg:text-[12.5px] lg:!leading-[22px] xl:text-[14.5px] 2xl:text-[18px]">
                Basic Validator
              </div>
              <div className="mt-[5px] text-[8px] font-semibold text-[#505050] md:mt-[6px] md:text-[9px] lg:mt-[7px] lg:text-[11px] lg:!leading-[19px] xl:text-[13px] 2xl:mt-[10px] 2xl:text-[16px]">
                {String(data.serversNumber)} x {data.serverType} servers
              </div>
              <div className="mt-[8px] text-[8px] font-medium text-[#959595] md:mt-[9px] md:text-[9px] lg:mt-[10.5px] lg:text-[11px] lg:!leading-[19px] xl:text-[13px] 2xl:mt-[15px] 2xl:text-[16px]">
                <div className="">Best for:</div>
                <ul className="list-disc pl-[25px]">
                  <li>Designing custom data products</li>
                  <li>Data visualization</li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className={`mt-[18px] flex gap-x-[5px] md:mt-[19.2px] md:gap-x-[6px] lg:mt-[22.5px] lg:gap-x-[7px] xl:gap-x-[8px] 2xl:mt-[32px] 2xl:gap-x-[10px]`}
          >
            {Array.from({ length: data.serversNumber }).map((_, index) => (
              <img
                key={index}
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/presets/server.svg`}
                alt="image"
                className={`h-[18px] w-[22.5px] md:h-[21.5px] md:w-[27px] lg:h-[25px] lg:w-[31.5px] xl:h-[29px] xl:w-[36px] 2xl:h-[36px] 2xl:w-[45px]`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* <div className="mt-[10px] rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px]   md:mt-[12px] md:px-[12px] md:py-[9px] lg:mt-[14px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[12px] 2xl:mt-[20px] 2xl:px-[20px] 2xl:py-[15px]">
        <div className="items-center  md:flex md:gap-x-[91px]  lg:gap-x-[107px] xl:gap-x-[122px]  2xl:gap-x-[153px]">
          <div className="text-[8px] font-semibold text-[#000] md:text-[9.6px]  lg:text-[11.2px]  lg:!leading-[19px] xl:text-[12.8px] 2xl:text-[16px]">
            * Number of servers
          </div>
          <div className="flex gap-x-[5px] text-[7px] font-bold text-[#505050] md:ml-auto md:text-[8px] lg:gap-x-[10px] lg:text-[10px] lg:!leading-[17px] xl:text-[11px] 2xl:text-[14px]">
            <div
              onClick={() => {
                data.onChangeServerType('small')
              }}
              className={`cursor-pointer  rounded-[3px] bg-[#f1f1f1] px-[10px] py-[3.25px] hover:bg-[#fff] md:px-[12px] md:py-[4px] lg:px-[14px] lg:py-[4.5px] xl:px-[16px] xl:py-[5.2px] 2xl:px-[20px] 2xl:py-[6.5px] ${
                data.serverType === 'small'
                  ? 'border-[2px] border-[#0354EC] shadow-[0_2px_5px_0px_rgba(3,84,236,0.50)]'
                  : 'border-[2px] border-[#D4D4D4]'
              }`}
            >
              Small
            </div>
            <div
              onClick={() => {
                data.onChangeServerType('large')
              }}
              className={`cursor-pointer rounded-[3px] bg-[#f1f1f1] px-[10px] py-[3.25px] hover:bg-[#fff] md:px-[12px] md:py-[4px] lg:px-[14px] lg:py-[4.5px] xl:px-[16px] xl:py-[5.2px] 2xl:px-[20px] 2xl:py-[6.5px] ${
                data.serverType === 'large'
                  ? 'border-[2px] border-[#0354EC] shadow-[0_2px_5px_0px_rgba(3,84,236,0.50)]'
                  : 'border-[2px] border-[#D4D4D4]'
              }`}
            >
              Large
            </div>
          </div>
          <div className="ml-auto flex gap-x-[5px] text-[7px] font-bold text-[#505050] md:gap-x-[6px] md:text-[8px] lg:gap-x-[7px] lg:text-[10px] lg:!leading-[17px] xl:gap-x-[8px] xl:text-[11px] 2xl:gap-x-[10px] 2xl:text-[14px]">
            {numberOfServersOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  data.onChangeServerNumber(option)
                }}
                className={`cursor-pointer  rounded-[3px] bg-[#f1f1f1] px-[13px] py-[3.25px] hover:bg-[#fff] md:px-[15.5px] md:py-[4px] lg:px-[18px] lg:py-[4.5px] xl:px-[21px] xl:py-[5.2px] 2xl:px-[26px] 2xl:py-[6.5px] ${
                  data.serversNumber === option
                    ? 'border-[2px] border-[#0354EC] shadow-[0_2px_5px_0px_rgba(3,84,236,0.50)]'
                    : 'border-[2px] border-[#D4D4D4]'
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </>
  )
}

export default ServerProvision

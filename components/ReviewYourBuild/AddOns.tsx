interface ModalProps {
  onValueChange(): void
}

const AddOns = ({ ...data }: ModalProps) => {
  return (
    <div className="relative flex rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] text-[#000] md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[12px] xl:pb-[360px] 2xl:px-[20px] 2xl:py-[15px] 2xl:pb-[450px]">
      <div className="relative flex items-center gap-x-[10px]">
        <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
          Add-ons
        </div>
      </div>
      <div className="ml-[47.5px] flex gap-x-[25px] md:ml-[57px] md:gap-x-[30px] lg:ml-[66.5px] lg:gap-x-[35px] xl:ml-[136px] xl:gap-x-[40px] 2xl:ml-[170px] 2xl:gap-x-[50px]">
        <div className="flex items-center gap-x-[7px] lg:gap-x-[15px]">
          <div
            className={`size-[10px] cursor-pointer rounded-[5px] border border-[#D9D9D9] bg-[#0354EC] hover:bg-[#0354EC] md:size-[12px] lg:size-[14px] xl:size-[16px] 2xl:size-[20px]`}
          ></div>
          <div className="flex 2xl:gap-x-[10px]">
            <div className="text-[10px] font-medium md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:text-[16px] 2xl:text-[20px]">
              Building a decentralized data infrastructure
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          data.onValueChange()
        }}
        className="ml-auto mr-[22.5px] cursor-pointer border-b border-[#0354EC] text-[10px] font-medium text-[#0354EC] hover:border-[#123981] hover:text-[#123981] md:mr-[27px] md:text-[12px] lg:mr-[31.5px] lg:text-[14px] lg:!leading-[24px] xl:mr-[36px] xl:text-[16px] 2xl:mr-[45px] 2xl:text-[20px]"
      >
        Edit
      </div>
      <img
        src={`${
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
            ? process.env.NEXT_PUBLIC_BASE_PATH
            : ''
        }/images/header/group-test.svg`}
        alt="image"
        className={`absolute w-[370px] md:w-[446px] lg:w-[520px] xl:left-[152px] xl:top-[40px] xl:w-[595px] 2xl:left-[190px] 2xl:top-[50px] 2xl:w-[743px]`}
      />
    </div>
  )
}

export default AddOns

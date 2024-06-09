import { prefix } from '@/utils/prefix'

interface ModalProps {
  onValueChange(): void
}

const AddOns = ({ ...data }: ModalProps) => {
  return (
    <div className="relative flex rounded-[10px] bg-[#F9F9F9] px-[10px] py-[8px] text-black md:px-[12px] md:py-[9px] lg:px-[14px] lg:py-[11px] xl:px-[16px] xl:py-[12px] xl:pb-[360px] 2xl:px-[20px] 2xl:py-[15px] 2xl:pb-[450px]">
      <div className="relative flex items-center gap-x-[10px]">
        <div className="text-[10px] font-bold md:text-[12px] lg:text-[14px] lg:!leading-[24px] xl:pl-[5px] xl:text-[16px] 2xl:text-[20px]">
          Add-ons
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
        src={`${prefix}/images/connections/addOns.svg`}
        alt="image"
        className={`absolute w-[370px] md:w-[446px] lg:w-[520px] xl:left-[232px] xl:top-[40px] xl:w-[510px] 2xl:left-[290px] 2xl:top-[50px] 2xl:w-[638px]`}
      />
    </div>
  )
}

export default AddOns

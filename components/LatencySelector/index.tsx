import { useState } from 'react'

const LatencySelector = ({ onValueChange }) => {
  const [value, setValue] = useState('Low')

  const valueOptions = ['Low', 'Med', 'High']

  return (
    <div className="flex justify-center rounded-[5px] bg-[#f2f2f2] p-[3px] md:p-[3.6px] lg:p-[4.2px] xl:p-[4.8px] 2xl:p-[6px]">
      {valueOptions.map((option, index) => (
        <div
          className={`${
            option === value
              ? 'bg-[linear-gradient(255deg,_#94E50E_0%,_#12AD50_50.52%,_#12AD50_100%)] text-[#fff]'
              : ''
          } flex size-full cursor-pointer items-center rounded-[3px] px-[12.5px] py-[6.25px] text-center text-[7px] font-bold text-[#959595] transition duration-500 ease-in-out hover:bg-[#e0e0e0] md:px-[15px] md:py-[7.5px] md:text-[8px] lg:px-[17.5px] lg:py-[8.75px] lg:text-[10px] lg:!leading-[17px] xl:px-[20px] xl:py-[10px] xl:text-[11px] 2xl:px-[25.5px] 2xl:py-[12.5px] 2xl:text-[14px]`}
          key={index}
          onClick={() => {
            setValue(option)
            onValueChange(option)
          }}
        >
          <div className="mx-auto flex text-center"> {option}</div>
        </div>
      ))}
    </div>
  )
}

export default LatencySelector
